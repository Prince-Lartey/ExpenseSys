<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import Input from "$lib/components/ui/input/input.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Table from "$lib/components/ui/table"
    import Pagination from "$lib/components/Pagination.svelte"
    import { Loader2 } from 'lucide-svelte';
    import { transactionSchema } from '$lib/schema';
    import { superForm } from 'sveltekit-superforms';
    import { zodClient } from 'sveltekit-superforms/adapters';
    import { toast } from 'svelte-sonner';
    import CategoryForm from "$lib/components/CategoryForm.svelte";
    import { formatCurrency, formatDate } from "$lib/utils"
    import { fly } from 'svelte/transition'

    export let data;

    let transactions = data.transactions; // Make transactions reactive
    const { categories, transactionForm } = data

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
    let selectedCategoryId = $formData.category;

    // Function to handle category selection
    function handleCategorySelect(event: CustomEvent) {
        console.log("Selected Category ID:", event.detail);
        selectedCategoryId = event.detail
        formData.category = selectedCategoryId
    }

    async function handleFormSubmit(event) {
        event.preventDefault();
        
        const formElement = event.target as HTMLFormElement;
        const formDataToSend = new FormData(formElement);

        // Append category to FormData explicitly to ensure it's sent
        formDataToSend.set('category', selectedCategoryId);

        // Fetch submission to the action
        const response = await fetch('?/createTransaction', {
            method: 'POST',
            body: formDataToSend,
        });

        if (response.ok) {
            const newTransaction = await response.json();

            // Re-create transactions array to trigger reactivity
            transactions = [newTransaction, ...transactions];

            // Clear form fields
            $formData.name = '';
            $formData.amount = '';
            $formData.date = '';
            $formData.category = ''

            // Optionally reset selected category ID
            selectedCategoryId = ''

            toast.success("Transaction added successfully!")
        } else {
            const errorResponse = await response.json();
            if (errorResponse.form) {
                // Set the errors from the response
                formData.errors = errorResponse.form.errors;
                toast.error("There was an error submitting the form.");
            }
            
        }
    }
</script>

<div class="mx-auto flex h-full max-w-5xl md:items-normal md:justify-normal">
    <div>
        <h1 class="text-2xl">Add a Transaction</h1>
        <p class="text-xs text-muted-foreground">Enter details of your transaction below.</p>
        
        <!-- Form setup with superform's enhance -->
        <form  method="POST" on:submit={handleFormSubmit} class="mt-5 space-y-3">
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
                        <CategoryForm bind:selectedCategoryId on:categorySelect={handleCategorySelect} />
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
                    {#if $submitting}
                        <Loader2 class="size-6 animate-spin" />
                    {:else}
                        Save Transaction
                    {/if}
                </Form.Button>
            </div>
        </form>
    </div>
</div>
