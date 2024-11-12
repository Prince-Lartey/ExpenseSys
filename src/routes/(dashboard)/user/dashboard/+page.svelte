<script lang="ts">
    import { formatCurrency, formatDate } from "$lib/utils"
    import * as Table from "$lib/components/ui/table"
    import Pagination from "$lib/components/Pagination.svelte"
    import type { Transaction, Category } from "$lib/types"

    // Example props
    export let data

    // Extracting values from data
    const { currentBalance, totalIncome, totalExpense } = data

    let transactions = data.transactions; // Make transactions reactive
    const categories = data.categories as Category[]

    const itemsPerPage = 5;
    let currentPage = 1

    // Function to get the current page's transactions
    $: paginatedTransactions = () => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return transactions.slice(start, end);
    };

    // Calculate total pages
    function calculateTotalPages() {
        return Math.ceil(transactions.length / itemsPerPage);
    }

    // Update page when event is received
    function onPageChange(event: CustomEvent<number>) {
        currentPage = event.detail;
    }

    // Create a mapping of category ID to category name
    const categoryMap: Record<string, string> = categories.reduce((acc, category: Category) => {
        acc[category.id] = category.name;
        return acc;
    }, {} as Record<string, string>)
</script>

<div class="mx-auto max-w-7xl p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
    <!-- First Column -->
    <div class="space-y-5">
        <!-- Financial Summary Section -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div class="p-5 bg-gray-100 shadow rounded">
                <h2 class="text-sm font-semibold mb-4">Current Balance</h2>
                <p class="text-normal font-bold">{formatCurrency(currentBalance)}</p>
            </div>
            <div class="p-5 bg-gray-100 shadow rounded">
                <h2 class="text-sm font-semibold mb-4">Total Income</h2>
                <p class="text-normal font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
            <div class="p-5 bg-gray-100 shadow rounded">
                <h2 class="text-sm font-semibold mb-4">Total Expense</h2>
                <p class="text-normal font-bold text-red-600">{formatCurrency(totalExpense)}</p>
            </div>
        </div>

        <!-- Graph Section -->
        <div class="p-5 bg-white shadow rounded h-64">
            <h2 class="text-lg font-semibold mb-3">Monthly Transactions</h2>
            <!-- Replace with a graph component -->
            <!-- <Graph {monthlyTransactions} /> -->
            <p>Graph showing the month against the transaction amount goes here.</p>
        </div>
    </div>

    <!-- Second Column - Transaction List -->
    <div class="pb-2 px-5 shadow rounded-md">
        <h2 class="text-lg mb-4 font-bold">Latest Transactions</h2>
        
        <Table.Root>
            <Table.Caption class="mb-5">A list of your recent transactions</Table.Caption>
            <Table.Header class="">
                <Table.Row class="border-t">
                    <Table.Head class="border-x">Transaction name</Table.Head>
                    <Table.Head class="border-r">Category</Table.Head>
                    <Table.Head class="border-r">Amount</Table.Head>
                    <Table.Head class="border-r">Date</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body class="border-b">
                {#each paginatedTransactions() as transaction (transaction.id)}
                    <Table.Row >
                        <Table.Cell class="font-medium border-x capitalize">{transaction.name}</Table.Cell>
                        <Table.Cell class="border-r">{categoryMap[transaction.category]}</Table.Cell>
                        <Table.Cell class="border-r">{formatCurrency(transaction.amount)}</Table.Cell>
                        <Table.Cell class="border-r">{formatDate(transaction.date)}</Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>

        <div class="mb-5">
            <Pagination totalPages={calculateTotalPages()} {currentPage} on:pageChange={onPageChange} />
        </div>
    </div>
    
</div>
