import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { ExpenseChart } from "../components/ExpenseChart";
import { NewTransactionModal } from "../components/NewTransactionModal";
import { NavigationModal } from "../components/NavigationModal";
import api from "../../lib/axios";

export default function Dashboard() {
    const [summary, setSummary] = useState<any>(null);
    const [trend, setTrend] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    useEffect(() => {
        api.get("/dashboard")
            .then((res) => {
                setSummary(res.data.monthly_summary);
                setTrend(res.data.expense_trend);
                setTransactions(res.data.recent_transactions);
            })
            .catch((err) => {
                console.error("ダッシュボードの取得に失敗", err);
            });
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        return `${month}月${day}日 ${hours}:${minutes}`;
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <nav className="border-b border-gray-800">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <span className="text-xl font-semibold">Summary</span>
                        <NavigationModal />
                    </div>
                </div>
            </nav>
            <main className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0 space-y-6">
                    <div className="fixed bottom-4 right-4">
                        <NewTransactionModal />
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
                            <div className="flex justify-between items-center text-sm">
                                <div>
                                    <p className="text-gray-400">収入</p>
                                    <p className="text-xl font-semibold text-green-400">
                                        ¥500,000
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400">支出</p>
                                    <p className="text-xl font-semibold text-red-400">
                                        ¥280,000
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400">収支</p>
                                    <p className="text-xl font-semibold">
                                        ¥1,020,000
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <ExpenseChart />

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
