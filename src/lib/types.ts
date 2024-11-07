import type { RecordModel } from "pocketbase"
import type { TransactionSchema } from "./schema"


export type Transaction = RecordModel & TransactionSchema & {
    user: string
    category: Category
    amount: number
    date: Date
}

export type Category = RecordModel & {
    name: string
}