<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import Input from "$lib/components/ui/input/input.svelte"
    import Button from "$lib/components/ui/button/button.svelte"
    import { Loader2, Mail, Lock, User } from 'lucide-svelte';
    import { updateSchema } from "$lib/schema";
    import { superForm } from 'sveltekit-superforms'
    import { zodClient } from 'sveltekit-superforms/adapters'
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { toast } from "svelte-sonner"
    import settings from "$lib/stores/settings"

    export let data

    // Reactive statement to apply the theme class
    $: {
        const root = document.documentElement; // Root element (<html>)
        root.classList.toggle('dark', $settings.colorSchema === 'dark');
        root.classList.toggle('light', $settings.colorSchema === 'light');
    }

    // Create a writable store for the form data
    const formData = writable({
        firstName: data.form.data.firstName,
        lastName: data.form.data.lastName,
        email: data.form.data.email,
    });

    // Client side validation
    const form = superForm(data.form, {
        validators: zodClient(updateSchema)
    })

    const { enhance, delayed, submitting } = form

    // Custom enhance with result handling
    const customEnhance = (formElement: HTMLFormElement) =>
        enhance(formElement, {
            onResult: ({ result }) => {
                if (result.type === "success" && result.data) {
                    const { data } = result;

                    // Show success toast
                    toast.success(data.message || "Profile updated successfully.");

                    // Manually update the reactive store with updated user data
                    if (data.updatedUser) {
                        // Update form data directly with new user details
                        formData.set({
                            firstName: data.updatedUser.firstName,
                            lastName: data.updatedUser.lastName,
                            email: data.updatedUser.email,
                        });
                    }
                } else if (result.type === "error") {
                    // Extract error message for toast
                    const errorMessage = result.error?.message || "An unknown error occurred.";
                    toast.error(errorMessage);
                }
            },
        });
</script>

<div class="px-10 ">
    <h1 class="text-2xl font-bold mb-5">Settings</h1>

    <!-- Personal Information Section -->
    <div class="flex flex-col lg:flex-row w-full gap-10">
        <section class=" w-full lg:w-1/2">
            <div class="border-2 p-5 rounded-xl">
                <h2 class="text-xl font-semibold mb-3">Update Personal Information</h2>

                <form method="POST" action="?/update" use:customEnhance>
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
                                <Input type="email" {...attrs} disabled bind:value={$formData.email} placeholder="Email" class="pl-10 py-2 border border-gray-300 rounded-md w-full focus:border-blue-500 focus:outline-none mt-3"/>
                            </div>
                        </Form.Control>
                        <Form.FieldErrors />
                    </Form.Field>
            
                    <div class="flex justify-end">
                        <Form.Button class="mt-3">
                            {#if $submitting}
                                <Loader2 class="size-6 animate-spin"/>
                            {:else}
                                Submit
                            {/if}
                        </Form.Button>
                    </div>
                </form>
            </div>
        </section>

        <!-- Appearance Section -->
        <section class="w-full lg:w-1/2">
            <div class="border-2 p-5 rounded-xl">
                <h2 class="text-xl font-semibold mb-5">Toggle Background Appearance</h2>
                <label>
                    <input type="radio" name="colorSchema" value="dark" on:change={() => settings.updateSettings('colorSchema', 'dark')} checked={$settings.colorSchema === 'dark'}/>
                    Dark
                </label>
                <label>
                    <input type="radio" name="colorSchema" value="light" on:change={() => settings.updateSettings('colorSchema', 'light')} checked={$settings.colorSchema === 'light'}/>
                    Light
                </label>
            </div>
        </section>
    </div>
</div>