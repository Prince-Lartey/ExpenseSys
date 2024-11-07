<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import Input from "$lib/components/ui/input/input.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Loader2 } from 'lucide-svelte';
    import { transactionSchema } from '$lib/schema.js';
    import { superForm } from 'sveltekit-superforms';
    import { zodClient } from 'sveltekit-superforms/adapters';
    import { toast } from 'svelte-sonner';
    import CategoryForm from "$lib/components/CategoryForm.svelte";
    import { get } from "svelte/store"

    export let data;

    // Initialize superForm with transaction schema and client-side validation
    const form = superForm(data.transactionForm, {
        validators: zodClient(transactionSchema),
        onUpdated({ form }) {
            if (form.message && !form.valid) {
                toast.error(form.message);
            }
        }
    });

    const { form: formData, enhance, delayed, submitting } = form;
    let selectedCategory = $formData.category;

    // Function to handle category selection
    function handleCategorySelect(event: CustomEvent) {
        console.log("Selected Category ID:", event.detail);
        // selectedCategory = event.detail
        $formData.category = event.detail
    }

    function handleFormSubmit(event) {
        console.log("Form Submission:", get(formData)); // Log form data to confirm it's complete before submission
    }
</script>

<div class="mx-auto flex h-full max-w-5xl md:items-normal md:justify-normal">
    <div>
        <h1 class="text-2xl">Add a Transaction</h1>
        <p class="text-xs text-muted-foreground">Enter details of your transaction below.</p>

        
        <!-- Form setup with superform's enhance -->
        <form use:enhance action="?/createTransaction" method="POST" on:submit={handleFormSubmit} class="mt-5 space-y-3">
            <div class="flex gap-x-5">
                <Form.Field {form} name="name">
                    <Form.Control let:attrs>
                        <Form.Label>Name</Form.Label>
                        <Input {...attrs} bind:value={$formData.name} />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>

                <!-- Category Field (using CategoryForm) -->
                <Form.Field {form} name="category">
                    <Form.Control let:attrs>
                        <Form.Label>Category</Form.Label>
                        <!-- Pass current category and bind to handleCategorySelect -->
                        <CategoryForm selectedCategoryId={$formData.category} on:categorySelect={handleCategorySelect} />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>

                <Form.Field {form} name="amount">
                    <Form.Control let:attrs>
                        <Form.Label>Amount</Form.Label>
                        <Input type="number" {...attrs} bind:value={$formData.amount} min="0" />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>

                <Form.Field {form} name="date">
                    <Form.Control let:attrs>
                        <Form.Label>Date</Form.Label>
                        <Input type="date" {...attrs} bind:value={$formData.date} />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
            </div>

            <div class="flex items-center gap-x-2">
                <Button variant="secondary" href="/">Cancel</Button>
                <Form.Button>
                    {#if $delayed}
                        <Loader2 class="size-6 animate-spin" />
                    {:else}
                        Save Transaction
                    {/if}
                </Form.Button>
            </div>
        </form>
    </div>
</div>
