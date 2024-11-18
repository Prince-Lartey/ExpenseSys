import { loginSchema } from "$lib/schema"
import { message, superValidate } from "sveltekit-superforms";
import { zod } from 'sveltekit-superforms/adapters'
import { fail, redirect } from "@sveltejs/kit";
import type { ClientResponseError } from "pocketbase";

export const load = (async () => {
    return {
        form: await superValidate(zod(loginSchema))
    };
})

export const actions = {
    default: async (event) => {
        const { locals: { pb }} = event
        const form = await superValidate(event, zod(loginSchema))

        if (!form.valid) {
            return fail(400, { form })
        }

        try {
            await pb.collection('users').authWithPassword(form.data.email, form.data.password)
        }
        catch (error) {
            const { status } = error as ClientResponseError
            return message(form, { status, message: 'Invalid email or password.' })
        }
        redirect(303, '/user/dashboard')
    }
}