

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

    const initializeMonthlyData = () => {
        const months = Array.from({ length: 12 }, (_, i) => ({
            month: new Date(0, i).toLocaleString('default', { month: 'short' }),
            income: 0,
            expense: 0
        }));
        return months;
    };

    const currentYear = new Date().getFullYear(); // Default year
    const monthlyData = initializeMonthlyData();


    transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        const transactionYear = transactionDate.getFullYear();
        const transactionMonth = transactionDate.getMonth(); // 0-11 for Jan-Dec

        // Filter transactions by the selected year
        if (transactionYear === currentYear) {
            const categoryName = transaction.expand?.category?.name;

            if (categoryName === 'income') {
                monthlyData[transactionMonth].income += transaction.amount;
            } else if (categoryName === 'expense') {
                monthlyData[transactionMonth].expense += transaction.amount;
            }
        }
    });

    const totalIncome = monthlyData.reduce((sum, month) => sum + month.income, 0);
    const totalExpense = monthlyData.reduce((sum, month) => sum + month.expense, 0);
    const currentBalance = totalIncome - totalExpense;

    return {
        categories,
        transactions,
        totalIncome,
        totalExpense,
        currentBalance,
        monthlyData,
    };
}