import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Transaction } from "../../types/transactions";
import { EditTransactionModal } from "./EditTransactionModal";
import { Category } from "../../types/categories";
import { PaymentMethod } from "../../types/paymentMethod";

const transactionCardClassName =
    "overflow-hidden rounded-[32px] border-border/70 bg-background/55 shadow-[0_32px_80px_-36px_rgba(15,23,42,0.45)] backdrop-blur-sm";

const transactionPanelClassName =
    "rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm backdrop-blur-sm";

type TransactionListProps = {
    transactions: Transaction[];
    onSuccess: () => void;
    allCategories: Category[];
    allPaymentMethods: PaymentMethod[];
};

export function TransactionList({
    transactions,
    onSuccess,
    allCategories,
    allPaymentMethods,
}: TransactionListProps) {
    const now = new Date();
    const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(
        now.getMonth() + 1
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, "M月d日");
    };

    // 取引年の選択肢を動的に生成する
    const years = Array.from(
        new Set([selectedYear, ...transactions.map((t) => t.year)])
    ).sort((a, b) => b - a);

    const filteredTransactions = transactions.filter(
        (transaction) =>
            transaction.year === selectedYear &&
            transaction.month === selectedMonth
    );

    const [editingTransaction, setEditingTransaction] =
        useState<Transaction | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const { totalIncome, totalExpense } = useMemo(() => {
        return filteredTransactions.reduce(
            (totals, transaction) => {
                if (transaction.transaction_type_id === 1) {
                    totals.totalIncome += transaction.amount;
                } else {
                    totals.totalExpense += transaction.amount;
                }
                return totals;
            },
            { totalIncome: 0, totalExpense: 0 }
        );
    }, [filteredTransactions]);

    return (
        <>
            <Card className={transactionCardClassName}>
                <CardHeader className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                Transaction History
                            </p>
                            <CardTitle className="text-lg font-medium">
                                取引履歴
                            </CardTitle>
                        </div>
                        <div className="flex gap-2">
                            <Select
                                onValueChange={(value) =>
                                    setSelectedYear(Number(value))
                                }
                                value={String(selectedYear)}
                            >
                                <SelectTrigger className="h-10 w-[100px] rounded-xl border-border/60 bg-background/80 shadow-sm">
                                    <SelectValue placeholder="年" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((year) => (
                                        <SelectItem
                                            key={year}
                                            value={String(year)}
                                        >
                                            {year}年
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                onValueChange={(value) =>
                                    setSelectedMonth(Number(value))
                                }
                                value={String(selectedMonth)}
                            >
                                <SelectTrigger className="h-10 w-[100px] rounded-xl border-border/60 bg-background/80 shadow-sm">
                                    <SelectValue placeholder="月" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[...Array(12)].map((_, i) => (
                                        <SelectItem
                                            key={i + 1}
                                            value={String(i + 1)}
                                        >
                                            {i + 1}月
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className={transactionPanelClassName}>
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                収入
                            </p>
                            <p className="mt-3 text-2xl font-semibold text-emerald-500 dark:text-emerald-300">
                                ¥{totalIncome.toLocaleString()}
                            </p>
                        </div>
                        <div className={transactionPanelClassName}>
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                支出
                            </p>
                            <p className="mt-3 text-2xl font-semibold text-rose-500 dark:text-rose-300">
                                ¥{Math.abs(totalExpense).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {filteredTransactions.length > 0 ? (
                        <ul className="space-y-3">
                            {filteredTransactions.map((transaction, index) => {
                                const isIncome =
                                    transaction.transaction_type_id === 1;

                                return (
                                    <li
                                        key={
                                            transaction.transaction_id ?? index
                                        }
                                        className="flex cursor-pointer items-start justify-between rounded-2xl border border-border/60 bg-background/70 px-4 py-4 text-sm shadow-sm backdrop-blur-sm transition-colors hover:bg-background/90"
                                        onClick={() => {
                                            setEditingTransaction(transaction);
                                            setEditModalOpen(true);
                                        }}
                                    >
                                        <div className="min-w-0 flex-1 pr-4">
                                            <p className="truncate font-medium text-foreground">
                                                {transaction.memo}
                                            </p>
                                            <p className="mt-1 text-muted-foreground">
                                                {formatDate(transaction.date)}{" "}
                                            </p>
                                        </div>
                                        <p
                                            className={`shrink-0 text-right text-base font-semibold ${
                                                isIncome
                                                    ? "text-emerald-500 dark:text-emerald-300"
                                                    : "text-rose-500 dark:text-rose-300"
                                            }`}
                                        >
                                            {isIncome ? "+" : "-"}¥
                                            {Math.abs(
                                                transaction.amount,
                                            ).toLocaleString()}
                                        </p>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-border/70 bg-background/60 px-4 py-10 text-center text-muted-foreground">
                            取引がありません
                        </div>
                    )}
                </CardContent>
            </Card>
            {editingTransaction && (
                <EditTransactionModal
                    key={editingTransaction.transaction_id}
                    open={editModalOpen}
                    setOpen={setEditModalOpen}
                    transaction={editingTransaction}
                    onSuccess={onSuccess}
                    allCategories={allCategories}
                    allPaymentMethods={allPaymentMethods}
                />
            )}
        </>
    );
}
