<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let totalPages: number;
    export let currentPage: number;
    const dispatch = createEventDispatcher();

    // Emit a change event when a page is selected
    const changePage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            dispatch('pageChange', page);
        }
    };
</script>

<div class="flex justify-center items-center space-x-2">
    <button on:click={() => changePage(currentPage - 1)} disabled={currentPage === 1} class="px-3 py-1 text-sm">
        Previous
    </button>

    {#each Array(totalPages).fill(0) as _, index}
        <button 
            class="px-3 py-1" 
            class:selected={index + 1 === currentPage}
            on:click={() => changePage(index + 1)}>
            {index + 1}
        </button>
    {/each}

    <button on:click={() => changePage(currentPage + 1)} disabled={currentPage === totalPages} class="px-3 py-1 text-sm">
        Next
    </button>
</div>

<style>
    button.selected {
        background-color: gray;
        color: white;
        font-weight: bold;
    }
</style>
