export interface PaymentMethod {
    payment_method_id: string;
    user_id: number;
    name: string;
    transaction_type_id: number;
    deleted: boolean;
}
