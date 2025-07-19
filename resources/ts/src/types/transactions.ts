export type Transaction = {
    transaction_id: number;
    transaction_type_id: number;
    date: string;
    memo: string;
    amount: number;
    // APIレスポンスにないが、フロントで追加して使う
    year: number;
    month: number;
    day: number;
};
