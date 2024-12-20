import { superValidate } from 'sveltekit-superforms';
import { transactionSchema } from '$lib/schema';
import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import { zod } from 'sveltekit-superforms/adapters'

export const load = async ({ locals: { pb, user } }) => {
    if (!user) throw redirect(303, '/login');

    // Fetch categories from PocketBase
    const categories = await pb.collection('categories').getFullList({
        sort: '-created'
    });

    // Fetch transactions from PocketBase
    const transactions = await pb.collection('transactions').getFullList({
        filter: `user = "${user?.id}"`,
        sort: '-date'
    });

    // Initialize the form for the transaction
    const transactionForm = await superValidate(zod(transactionSchema));

    return {
        categories,
        transactionForm,
        transactions
    };
};

export const actions: Actions = {
    createTransaction: async ({ request, locals: { pb, user } }) => {
        if (!user) throw redirect(303, '/login');

        const formData = await request.formData();
        const data = Object.fromEntries(formData.entries());

        // Parse the amount as a number
        const parsedData = {
            ...data,
            amount: parseFloat(data.amount as string), // Parse the amount here
            user: user.id, // Associate transaction with the current user
        };

        // Validate the form data
        const form = await superValidate(parsedData, zod(transactionSchema));
        
        // If validation fails, return the form with errors
        if (!form.valid) {
            console.log("Validation failed:", form.errors)
            return fail(400, { form });
        }

        if (!pb.authStore.isValid) {
            throw new Error("User is not authenticated.");
        }

        // Attempt to create the transaction in PocketBase
        try {
            await pb.collection('transactions').create({
                name: form.data.name,
                category: form.data.category,
                amount: form.data.amount,
                date: form.data.date,
                user: pb.authStore.model?.id
            });
            return { success: true, message: 'Transaction created successfully' };
        } catch (e) {
            const error = e as ClientResponseError;
            console.error("Error creating transaction:", error.response.data);
            return fail(500, { form, message: error.message });
        }
    }
};