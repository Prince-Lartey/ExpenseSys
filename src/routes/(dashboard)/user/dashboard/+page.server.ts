

export const load = async ({ locals: { pb } }) => {
    // Fetch categories from PocketBase
    const categories = await pb.collection('categories').getFullList({
        sort: '-created'
    });

    // Fetch transactions from PocketBase
    const transactions = await pb.collection('transactions').getFullList({
        sort: '-date',
        expand: 'category',
    });

    console.log("Transactions:", transactions);

    // Calculate totals
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(transaction => {
        const categoryName = transaction.expand?.category?.name; // Access expanded category name
        if (categoryName === 'income') {
            totalIncome += transaction.amount;
        } else if (categoryName === 'expense') {
            totalExpense += transaction.amount;
        }
    });

    const currentBalance = totalIncome - totalExpense;

    console.log("Total Income:", totalIncome);
    console.log("Total Expense:", totalExpense);
    console.log("Current Balance:", currentBalance)

    return {
        categories,
        transactions,
        totalIncome,
        totalExpense,
        currentBalance,
    };
}