import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { ExpenseChart } from "../components/ExpenseChart";
import { NewTransactionModal } from "../components/transaction/NewTransactionModal";
import { NavigationModal } from "../components/NavigationModal";
import api from "../../lib/axios";

import type {
    MonthlySummary,
    ExpenseTrend,
    RecentTransaction,
    DashboardResponse,
} from "../types/dashboard";
import { Category } from "../types/categories";
import { PaymentMethod } from "../types/paymentMethod";
import { toast } from "react-toastify";

export default function Dashboard() {
    const [summary, setSummary] = useState<MonthlySummary | null>(null);
    const [trend, setTrend] = useState<ExpenseTrend[]>([]);
    const [transactions, setTransactions] = useState<RecentTransaction[]>([]);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [allPaymentMethods, setAllPaymentMethods] = useState<PaymentMethod[]>(
        []
    );
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const formatDate = (dateString: string) => {
        return format(dateString, "M月d日");
    };

    const fetchDashboardData = () => {
        Promise.all([
            api.get<DashboardResponse>("/dashboard"),
            api.get("/categories"),
            api.get("/payment-methods"),
        ])
            .then(([dashboardRes, categoriesRes, paymentMethodsRes]) => {
                setSummary(dashboardRes.data.monthly_summary);
                setTrend(dashboardRes.data.expense_trend);
                setTransactions(dashboardRes.data.recent_transactions);
                setAllCategories(categoriesRes.data.data);
                setAllPaymentMethods(paymentMethodsRes.data.data);
            })
            .catch((err) => {
                console.error("初期データの取得に失敗", err);
                toast.error("初期データの取得に失敗しました。");
            });
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white">
            <nav className="border-b border-gray-800">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <span className="text-xl font-semibold">ホーム</span>
                        <NavigationModal />
                    </div>
                </div>
            </nav>
            <main className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0 space-y-6">
                    <div className="fixed bottom-4 right-4">
                        <NewTransactionModal
                            onSuccess={fetchDashboardData}
                            allCategories={allCategories}
                            allPaymentMethods={allPaymentMethods}
                        />
                    </div>
                    <Card className="bg-black border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">
                                今月の収支情報
                            </CardTitle>
                            <p className="text-gray-400">
                                {year}年 {month}月
                            </p>
                        </CardHeader>
                        <CardContent>
                            {summary && (
                                <div className="flex justify-between items-center text-sm">
                                    <div>
                                        <p className="text-gray-400">収入</p>
                                        <p className="text-xl font-semibold text-green-400">
                                            ¥
                                            {parseInt(
                                                summary.income
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">支出</p>
                                        <p className="text-xl font-semibold text-red-400">
                                            ¥
                                            {parseInt(
                                                summary.expense
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">収支</p>
                                        <p className="text-xl font-semibold">
                                            ¥{summary.balance.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {trend && <ExpenseChart trend={trend} />}

                    <Card className="bg-black border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">
                                最近の取引
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {transactions.map((transaction) => {
                                    const amount = parseFloat(
                                        transaction.amount
                                    );
                                    const isIncome =
                                        transaction.transaction_type_id === 1;

                                    return (
                                        <li
                                            key={transaction.id}
                                            className="flex justify-between items-center text-sm"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {transaction.memo}
                                                </p>
                                                <p className="text-gray-400">
                                                    {formatDate(
                                                        transaction.transaction_date
                                                    )}{" "}
                                                </p>
                                            </div>
                                            <p
                                                className={`font-medium ${
                                                    isIncome
                                                        ? "text-green-400"
                                                        : "text-red-400"
                                                }`}
                                            >
                                                {isIncome ? "+" : "-"}¥
                                                {Math.abs(
                                                    amount
                                                ).toLocaleString()}
                                            </p>
                                        </li>
                                    );
                                })}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
