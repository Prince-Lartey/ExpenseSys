<script lang="ts">
    import { formatCurrency, formatDate } from "$lib/utils"
    import * as Table from "$lib/components/ui/table"
    import Button from "$lib/components/ui/button/button.svelte"; 
    import Pagination from "$lib/components/Pagination.svelte"
    import type { Transaction, Category } from "$lib/types"
    import Svelecte from 'svelecte'
    import { onMount } from "svelte"
    import { Trash } from 'lucide-svelte'
    import { toast } from 'svelte-sonner';

    // Example props
    export let data

    // Extracting values from data
    const { currentBalance, totalIncome, totalExpense, monthlyData } = data

    let transactions = data.transactions; // Make transactions reactive
    const categories = data.categories as Category[]

    let selectedYear = new Date().getFullYear();
    const availableYears = Array.from(new Set(data.transactions.map(tx => new Date(tx.date).getFullYear())));

    const colors = { income: 'green', expense: 'red' };
    let canvasContext: HTMLCanvasElement;

    // Draw the chart when the component is mounted
    onMount(() => {
        if (canvasContext) {
            drawChart();
        }
    });

    // Redraw chart when year or monthlyData changes
    $: if (canvasContext) {
        drawChart();
    }

    function drawChart() {
        const ctx = canvasContext.getContext("2d");
        if (!ctx) return;

        // Clear the canvas
        ctx.clearRect(0, 0, canvasContext.width, canvasContext.height);

        // Define chart dimensions and settings
        const chartHeight = 150; // Height for the tallest bar
        const barWidth = 20;
        const gap = 0;
        const paddingLeft = 30; // Left padding for y-axis labels

        const maxIncomeExpense = Math.max(...monthlyData.map(m => m.income), ...monthlyData.map(m => m.expense));
        const scale = chartHeight  / maxIncomeExpense;

        // Draw Y-axis labels (for values 0%, 25%, 50%, 75%, 100% of max)
        ctx.font = '10px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 4; i++) {
            const y = chartHeight - (i * chartHeight / 4);
            const label = Math.round((i * maxIncomeExpense) / 4).toString();
            ctx.fillText(label, paddingLeft - 5, y); // Y-axis labels
            ctx.beginPath();
            ctx.moveTo(paddingLeft, y);
            ctx.lineTo(paddingLeft + 120 * barWidth + gap * 12, y); // Draw horizontal lines across chart
            ctx.strokeStyle = '#e0e0e0';
            ctx.stroke();
        }

        monthlyData.forEach((month, index) => {
            const xPos = paddingLeft + index * (barWidth * 2 + gap)

            // Income bar
            ctx.fillStyle = colors.income;
            ctx.fillRect(xPos, chartHeight  - month.income * scale, barWidth, month.income * scale);

            // Expense bar
            ctx.fillStyle = colors.expense;
            ctx.fillRect(xPos + barWidth, chartHeight  - month.expense * scale, barWidth, month.expense * scale);

            // Month label
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.fillText(month.month, xPos + barWidth, chartHeight + 20); // X-axis month labels
        });
    }

    const itemsPerPage = 7;
    let currentPage = 1

    let selectedMonth: string | null = null; // Store selected month
    // Extract the unique months from transactions for the dropdown
    const months = [...new Set(transactions.map((transaction) => new Date((transaction as Transaction).date).toLocaleString('default', { month: 'short', year: 'numeric' })))];

    // Function to get the current page's transactions
    $: filteredTransactions = transactions.filter(transaction => {
        if (!selectedMonth) return true; // If no month is selected, show all
        const transactionMonth = new Date(transaction.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        return transactionMonth === selectedMonth;
    });

    // Function to get the current page's transactions
    $: paginatedTransactions = () => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredTransactions.slice(start, end);
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
    <div class="space-y-5 flex flex-col">
        <!-- Financial Summary Section -->
        <div class="px-5 bg-white rounded h-40">
            <h2 class="text-lg font-bold mb-3">Transaction Summary</h2>
            <div class="grid grid-cols-3 sm:grid-cols-3 gap-5">
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
        </div>

        <!-- Graph Section -->
        <div class="p-5 bg-white shadow rounded">
            <div class="flex gap-10 mb-10">
                <h2 class="text-lg font-bold mb-3">Monthly Transactions</h2>
                <Svelecte
                    bind:value={selectedYear}
                    options={availableYears.map(year => ({ label: year, value: year }))}
                    placeholder="Select Year"
                    on:change={() => drawChart()}
                />
            </div>

            <canvas bind:this={canvasContext} width="500" height="200"></canvas>
            <p class="text-xs">Graph showing the month against the transaction amount goes here.</p>
        </div>
    </div>

    <!-- Second Column - Transaction List -->
    <div class="pb-2 px-5 shadow rounded-md">
        <div class="flex gap-10">
            <h2 class="text-lg mb-4 font-bold">Latest Transactions</h2>

            <Svelecte
                bind:value={selectedMonth}
                options={months.map(month => ({ label: month, value: month }))}
                placeholder="Select a month"
                clearable
                class=" text-sm"
            />
        </div>
        
        <Table.Root>
            <Table.Caption class="mb-5">A list of your recent transactions</Table.Caption>
            <Table.Header class="">
                <Table.Row class="border-t">
                    <Table.Head class="border-x">Transaction name</Table.Head>
                    <Table.Head class="border-r">Category</Table.Head>
                    <Table.Head class="border-r">Amount</Table.Head>
                    <Table.Head class="border-r">Date</Table.Head>
                    <Table.Head class="border-r">Action</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body class="border-b">
                {#each paginatedTransactions() as transaction (transaction.id)}
                    <Table.Row >
                        <Table.Cell class="font-medium border-x capitalize">{transaction.name}</Table.Cell>
                        <Table.Cell class="border-r">{categoryMap[transaction.category]}</Table.Cell>
                        <Table.Cell class="border-r">{formatCurrency(transaction.amount)}</Table.Cell>
                        <Table.Cell class="border-r">{formatDate(transaction.date)}</Table.Cell>
                        <Table.Cell class="border-r">
                            <form method="POST" action="?/deleteTransaction" on:submit={() => toast.loading('Deleting transaction...')}>
                                <input type="hidden" name="transactionId" value={transaction.id} />
                                <button type="submit" class="text-red-600 size-6 hover:text-red-900" on:click={(e) => {if (!confirm('Are you sure you want to delete this transaction?')) e.preventDefault();}}>
                                    <Trash />
                                </button>
                            </form>
                        </Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>

        <div class="mb-5">
            <Pagination totalPages={calculateTotalPages()} {currentPage} on:pageChange={onPageChange} />
        </div>
    </div>
</div>
