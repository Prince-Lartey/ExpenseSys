<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import Input from "$lib/components/ui/input/input.svelte"
    import Button from "$lib/components/ui/button/button.svelte"
    import { Loader2, Mail, Lock, User } from 'lucide-svelte';
    import { registerSchema } from "$lib/schema";
    import { superForm } from 'sveltekit-superforms'
    import { zodClient } from 'sveltekit-superforms/adapters'

    export let data

    // Client side validation
    const form = superForm(data.form, {
        validators: zodClient(registerSchema)
    })

    const { form: formData, enhance, delayed, submitting } = form

</script>

<div>
	<h1 class="py-3 text-center text-2xl">Create an Account</h1>

    <p class='text-sm py-3'>Already have an account? <a href="/login" class='text-red-500 hover:underline cursor-pointer font-semibold'>Sign in</a></p>

	<form method="POST" action="?/register" use:enhance>
        <div class='grid grid-cols-2 gap-5'>
            <Form.Field {form} name="firstName">
                <Form.Control let:attrs>
                    <div class="relative my-2">
                        <User class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                        <Input type="firstName" {...attrs} bind:value={$formData.firstName} placeholder="First Name" class="pl-10 py-2 border border-gray-300 rounded-md w-full focus:border-blue-500 focus:outline-none"/>
                    </div>
                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>

            <Form.Field {form} name="lastName">
                <Form.Control let:attrs>
                    <div class="relative my-2">
                        <User class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                        <Input type="lastName" {...attrs} bind:value={$formData.lastName} placeholder="Last Name" class="pl-10 py-2 border border-gray-300 rounded-md w-full focus:border-blue-500 focus:outline-none"/>
                    </div>
                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>
        </div>

		<Form.Field {form} name="email">
			<Form.Control let:attrs>
				<div class="relative my-2">
                    <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <Input type="email" {...attrs} bind:value={$formData.email} placeholder="Email" class="pl-10 py-2 border border-gray-300 rounded-md w-full focus:border-blue-500 focus:outline-none mt-3"/>
                </div>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

        <Form.Field {form} name="password">
			<Form.Control let:attrs>
				<div class="relative my-2">
                    <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <Input type="password" {...attrs} bind:value={$formData.password} placeholder="Password" class="pl-10 py-2 border border-gray-300 rounded-md w-full focus:border-blue-500 focus:outline-none mt-3"/>
                </div>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

        <Form.Field {form} name="passwordConfirm">
			<Form.Control let:attrs>
				<div class="relative my-2">
                    <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <Input type="passwordConfirm" {...attrs} bind:value={$formData.passwordConfirm} placeholder="Confirm Password" class="pl-10 py-2 border border-gray-300 rounded-md w-full focus:border-blue-500 focus:outline-none mt-3"/>
                </div>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

        <Form.Button class="w-full mt-3">
            {#if $submitting}
                <Loader2 class="size-6 animate-spin"/>
            {:else}
                Create Account
            {/if}
        </Form.Button>

        <div class='my-4 flex items-center'>
            <div class='flex-grow border-t border-gray-300'></div>
            <div class='mx-4 text-gray-500 text-sm'>Or</div>
            <div class='flex-grow border-t border-gray-300'></div>
        </div>
	</form>

    <form method="POST" action="?/google">
        <Form.Button variant="secondary" class="w-full hover:bg-gray-200 transition-all" disabled >
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
            <span class="ml-2">Sign in with Google</span>
        </Form.Button>
    </form>
</div>