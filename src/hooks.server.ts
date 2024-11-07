// src/hooks.server.js
import { redirect } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    event.locals.pb = new PocketBase('http://127.0.0.1:8090'); // initializes a PocketBase client with the URL

    event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || ''); 
    try {
        event.locals.pb.authStore.isValid && await event.locals.pb.collection('users').authRefresh();
        event.locals.user = event.locals.pb.authStore.model
    } catch (_) {
        event.locals.pb.authStore.clear();
        event.locals.user = undefined
    }

    // Protecting routes except the login and register routes from non authenticated users.
    if (event.url.pathname.startsWith('/') && !event.locals.user && !['/login', '/register'].includes(event.url.pathname)) {
        redirect(303, '/login')
    }

    const response = await resolve(event);

    response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie());

    return response; 
}