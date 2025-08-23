export type Transaction = {
    transaction_id?: number;
    transaction_type_id: number;
    category_id: string;
    date: string;
    memo: string;
    amount: number;
    payment_method_id: number;
    year: number;
    month: number;
};
