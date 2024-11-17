import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
    try {
        // Assuming the user is stored in locals (e.g., from authentication)
        const user = locals.user;

        if (!user || !user.firstName || !user.lastName) {
            return json({ error: 'User data not found' }, { status: 404 });
        }

        // Get the first letter of the first name and last name
        const initials = user.firstName.charAt(0) + user.lastName.charAt(0);

        // Return initials as JSON
        return json({ initials });
    } catch (error) {
        console.error('Failed to fetch user initials:', error);
        return json({ error: 'Failed to fetch user initials' }, { status: 500 });
    }
};
