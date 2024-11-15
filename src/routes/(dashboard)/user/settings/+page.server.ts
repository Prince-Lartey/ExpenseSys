import { updateSchema } from "$lib/schema";
import { fail, redirect } from "@sveltejs/kit";
import type { ClientResponseError } from "pocketbase";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export const load = (async ({ locals: { pb, user } }) => {
    return {
        form: await superValidate({ ...user }, zod(updateSchema))
    };
})

export const actions = {
    update: async (event) => {
        const { locals: { pb, user } } = event;
        const form = await superValidate(event, zod(updateSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            // Update user details in PocketBase
            const updatedUser = await pb.collection("users").update(user?.id, form.data);

            // Return success with updated data
            return message(form, {
                message: "Profile updated successfully.",
                data: updatedUser
            });
        } 
        catch (error) {
            const { status } = error as ClientResponseError;
            return message(form, {
                status,
                message: "An error occurred while updating your information."
            });
        }

        // Redirect or return a success message as needed
        // return message(form, { message: 'Profile updated successfully.' });
    }
}