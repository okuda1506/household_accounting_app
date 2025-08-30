import { Category } from "./categories";
import { PaymentMethod } from "./paymentMethod";

export type RawTransaction = {
    transaction_id?: number;
    user_id: number;
    transaction_date: string;
    transaction_type_id: number;
    category: Category;
    payment_method: PaymentMethod;
    memo: string | null;
    amount: string;
};
