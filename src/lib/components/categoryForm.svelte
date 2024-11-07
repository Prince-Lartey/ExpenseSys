<script lang="ts">
	import type { Category } from '$lib/types';
    import { createEventDispatcher, onMount } from 'svelte';
    import { toast } from 'svelte-sonner';

    export let selectedCategoryId: string | null = null; // Bound to the parent form
    const dispatch = createEventDispatcher()

    let categories: Category[] = [];
    let loading = false;

    // Fetch categories from the API route
    async function fetchCategories() {
        loading = true;
        try {
            const response = await fetch('/api/categories');
            if (!response.ok) throw new Error("Failed to fetch categories");

            categories = await response.json();
        } 
        catch (error) {
            toast.error('Failed to fetch categories');
            console.error("Error:", error);
        } 
        finally {
            loading = false;
        }
    }

    // Fetch categories on component mount
    onMount(fetchCategories);

    function handleCategoryChange(event) {
        const selectedCategory = event.target.value;
        // Emit the event with the selected category
        dispatch('categorySelect', selectedCategory);
    }
</script>

<div class="category-form">
    {#if loading}
        <p>Loading categories...</p>
    {:else}
        <select id="category" bind:value={selectedCategoryId} on:change={handleCategoryChange} class="w-full p-2 border rounded-md">
            <option value="" disabled class="flex items-center justify-center">Select a category</option>
            {#each categories as category}
                <option value={category.id}>{category.name}</option>
            {/each}
        </select>
    {/if}
</div>