import { redirect } from "@sveltejs/kit";

export const GET = async ({ url, locals, cookies }) => {
    const redirectURL = `http://localhost:5173/oauth`

    // Retrieve state, verifier, and code from cookies and URL
    const state = cookies.get('state');
    const verifier = cookies.get('verifier');
    const receivedState = url.searchParams.get('state');
    const code = url.searchParams.get('code');

    // Verify state
    if (state !== receivedState) throw redirect(303, '/register');

    try {
        // Authenticate using Pocketbase's OAuth2 handler
        await locals.pb.collection('users').authWithOAuth2Code(
            'google',
            code,
            verifier,
            redirectURL
        );
        throw redirect(303, '/');
    } catch (error) {
        console.error("Error during Google Sign-In:", error);
        throw redirect(303, '/register');
    }
}