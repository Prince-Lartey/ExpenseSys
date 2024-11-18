import { error, redirect } from '@sveltejs/kit'

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

export const actions = {
    deleteTransaction: async ({ request, locals: { pb } }) => {
        try {
            // Parse the transaction ID from the form data
            const formData = await request.formData();
            const transactionId = formData.get('transactionId') as string;

            if (!transactionId) {
                throw error(400, 'Transaction ID is required');
            }

            // Perform the deletion in PocketBase
            await pb.collection('transactions').delete(transactionId);

            return { success: true };
        } catch (err) {
            console.error('Error deleting transaction:', err);
            throw error(500, 'Failed to delete transaction');
        }
    }
};