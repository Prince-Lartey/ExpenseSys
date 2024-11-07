import { redirect } from '@sveltejs/kit'

export const actions = {
    logout: async (event) => {
        const { locals: { pb }} = event
        pb.authStore.clear()
        redirect(303, '/login')
    }
}