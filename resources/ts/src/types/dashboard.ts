export interface MonthlySummary {
    income: string;
    expense: string;
    balance: number;
}

export interface ExpenseTrend {
    year: number;
    month: number;
    total_expense: number;
}

export interface RecentTransaction {
    id: number;
    user_id: number;
    transaction_date: string;
    transaction_type_id: number;
    category_id: number;
    amount: string;
    payment_method_id: number;
    memo: string;
    deleted: number;
    created_at: string;
    updated_at: string;
}

export interface DashboardResponse {
    monthly_summary: MonthlySummary;
    expense_trend: ExpenseTrend[];
    recent_transactions: RecentTransaction[];
}
