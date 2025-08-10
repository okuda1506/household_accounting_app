import { NewTransactionModal } from "../components/transaction/NewTransactionModal";
import { useEffect, useState } from "react";
import { NavigationModal } from "../components/NavigationModal";
import { TransactionList } from "../components/transaction/TransactionList";
import api from "../../lib/axios";
import { Transaction } from "../types/transactions";
import { RawTransaction } from "../types/rawTransaction";
import { toast } from "react-toastify";

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const fetchTransactions = async () => {
        try {
            const res = await api.get("/transactions");
            const rawTransactions: RawTransaction[] = res.data.data;

            const parsedTransactions: Transaction[] = rawTransactions.map(
                (t: RawTransaction) => {
                    const date = new Date(t.transaction_date);
                    return {
                        transaction_id:
                            t.transaction_id ??
                            `${t.user_id}-${t.transaction_date}`, // 適当なユニークキーを生成
                        transaction_type_id: t.transaction_type_id,
                        date: t.transaction_date,
                        memo: t.memo ?? "",
                        amount: Number(t.amount),
                        year: date.getFullYear(),
                        month: date.getMonth() + 1,
                        day: date.getDate(),
                    };
                }
            );
            setTransactions(parsedTransactions);
        } catch (err) {
            toast.error("取引データの取得に失敗しました");
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white">
            <nav className="border-b border-gray-800">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <span className="text-xl font-semibold">
                            Transactions
                        </span>
                        <NavigationModal />
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0 space-y-6">
                    <div className="fixed bottom-6 right-6 z-50">
                        <NewTransactionModal onSuccess={fetchTransactions} />
                    </div>
                    <TransactionList transactions={transactions} />
                </div>
            </main>
        </div>
    );
}
