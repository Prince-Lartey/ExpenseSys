import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
})

export const registerSchema = z.object({
    firstName: z.string().min(3, 'First name should be at least 3 letters'),
    lastName: z.string().min(3, 'Last name should be at least 3 letters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    passwordConfirm: z.string()
})
. refine((data) => data.password === data.passwordConfirm, {
    message: ' Password do not match',
    path: ['passwordConfirm']
})

export const updateSchema = z.object({
    firstName: z.string().min(3, 'First name should be at least 3 letters'),
    lastName: z.string().min(3, 'Last name should be at least 3 letters'),
    email: z.string().email('Invalid email address'),
})

export const transactionSchema = z.object({
    name: z.string().min(1, "Transaction name is required"),
    category: z.string().min(1, "Category is required"),
    amount: z.number().min(1, "Amount must be greater than 0"),
    date: z.string().min(1, "Date is required").refine(value => !isNaN(new Date(value).getTime()), "Invalid date")
});

export type TransactionSchema = z.infer<typeof transactionSchema>