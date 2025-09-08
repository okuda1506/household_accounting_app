import { NewTransactionModal } from "../components/transaction/NewTransactionModal";
import { useEffect, useState } from "react";
import { NavigationModal } from "../components/NavigationModal";
import { TransactionList } from "../components/transaction/TransactionList";
import api from "../../lib/axios";
import { Transaction } from "../types/transactions";
import { RawTransaction } from "../types/rawTransaction";
import { toast } from "react-toastify";
import { Category } from "../types/categories";
import { PaymentMethod } from "../types/paymentMethod";

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [allPaymentMethods, setAllPaymentMethods] = useState<PaymentMethod[]>([]);

    const fetchTransactions = async () => {
        try {
            const res = await api.get("/transactions");
            const rawTransactions: RawTransaction[] = res.data.data;

            const parsedTransactions: Transaction[] = rawTransactions.map(
                (t: RawTransaction) => {
                    const date = new Date(t.transaction_date);
                    return {
                        transaction_id: t.transaction_id,
                        transaction_type_id: t.transaction_type_id,
                        date: t.transaction_date,
                        memo: t.memo ?? "",
                        amount: Number(t.amount),
                        year: date.getFullYear(),
                        month: date.getMonth() + 1,
                        category_id: t.category.category_id,
                        payment_method_id: t.payment_method.payment_method_id,
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

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [categoriesRes, paymentMethodsRes] = await Promise.all([
                    api.get("/categories"),
                    api.get("/payment-methods"),
                ]);
                setAllCategories(categoriesRes.data.data);
                setAllPaymentMethods(paymentMethodsRes.data.data);
            } catch (err) {
                toast.error("カテゴリ・支払方法の取得に失敗しました。");
            }
        };
        fetchInitialData();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white">
            <nav className="border-b border-gray-800">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <span className="text-xl font-semibold">
                            取引一覧
                        </span>
                        <NavigationModal />
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0 space-y-6">
                    <div className="fixed bottom-6 right-6 z-50">
                        <NewTransactionModal
                            onSuccess={fetchTransactions}
                            allCategories={allCategories}
                            allPaymentMethods={allPaymentMethods}
                        />
                    </div>
                    <TransactionList
                        transactions={transactions}
                        onSuccess={fetchTransactions}
                        allCategories={allCategories}
                        allPaymentMethods={allPaymentMethods}
                    />
                </div>
            </main>
        </div>
    );
}
