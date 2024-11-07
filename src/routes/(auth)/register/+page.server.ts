import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET } from "$env/static/private";
import { registerSchema } from "$lib/schema";
import { fail, redirect } from "@sveltejs/kit";
import { OAuth2Client } from "google-auth-library";
import type { ClientResponseError } from "pocketbase";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from 'sveltekit-superforms/adapters'


export const load = (async () => {
    return {
        form: await superValidate(zod(registerSchema))
    };
})

export const actions = {
    register: async (event) => {
        const { locals: { pb } } = event
        const form = await superValidate(event, zod(registerSchema))

        if (!form.valid) {
            return fail(400, { form })
        }
        try {
            await pb.collection('users').create(form.data)
        }
        catch (error) {
            const { status } = error as ClientResponseError
            return message(form, { status, message: 'an error occurred' })
        }
        redirect(303, '/login')
    },

    // google: async ({ locals, url, cookies }) => {
    //     // List available OAuth providers from Pocketbase
    //     const authMethods = await locals.pb?.collection('users').listAuthMethods()
    //     if (!authMethods || !authMethods.authProviders.length) throw redirect(303, '/register');
        
    //     // Retrieve Google auth provider details
    //     const googleAuthProvider = authMethods.authProviders.find(provider => provider.name === 'google');
    //     if (!googleAuthProvider) throw redirect(303, '/register');

    //     // Set cookies for state and verifier
    //     cookies.set('state', googleAuthProvider.state, { path: '/' });
    //     cookies.set('verifier', googleAuthProvider.codeVerifier, { path: '/' });

    //     const redirectURL = 'http://localhost:5173/oauth'
    //     // Redirect user to Google for authentication
    //     throw redirect(302, `${googleAuthProvider.authUrl}${redirectURL}`);

    // }
};