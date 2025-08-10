export type RawTransaction = {
    transaction_id?: number;
    user_id: number;
    transaction_date: string;
    transaction_type_id: number;
    memo: string | null;
    amount: string;
};
