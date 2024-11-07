import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
    try {
        // Fetch all categories from the PocketBase 'categories' collection
        const categories = await locals.pb.collection('categories').getFullList();
        
        // Return categories as JSON
        return json(categories);
    } 
    catch (error) {
        console.error("Failed to fetch categories:", error);
        return json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
};