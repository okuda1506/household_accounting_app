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

const transactionSummaryCardClassName =
    "rounded-3xl border p-4 shadow-sm backdrop-blur-sm";

const transactionListShellClassName =
    "overflow-hidden rounded-3xl border border-border/60 bg-background/45 shadow-sm backdrop-blur-sm";

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
                        <CardTitle className="text-lg font-medium">
                            取引履歴
                        </CardTitle>
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
                    <section className="space-y-3">
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                月間サマリ
                            </p>
                            <p className="text-sm text-muted-foreground">
                                収入と支出をまとめて確認できます。
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div
                                className={`${transactionSummaryCardClassName} border-emerald-500/20 bg-emerald-500/[0.08]`}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-700/80 dark:text-emerald-200/80">
                                        収入
                                    </p>
                                </div>
                                <p className="mt-4 text-xl font-semibold text-emerald-600 dark:text-emerald-300 sm:text-2xl">
                                    ¥{totalIncome.toLocaleString()}
                                </p>
                            </div>
                            <div
                                className={`${transactionSummaryCardClassName} border-rose-500/20 bg-rose-500/[0.08]`}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-rose-700/80 dark:text-rose-200/80">
                                        支出
                                    </p>
                                </div>
                                <p className="mt-4 text-xl font-semibold text-rose-600 dark:text-rose-300 sm:text-2xl">
                                    ¥{Math.abs(totalExpense).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                取引データ
                            </p>
                            <p className="text-sm text-muted-foreground">
                                行をタップすると内容を編集できます。
                            </p>
                        </div>

                        {filteredTransactions.length > 0 ? (
                            <div className={transactionListShellClassName}>
                                <ul className="divide-y divide-border/50">
                                    {filteredTransactions.map(
                                        (transaction, index) => {
                                            const isIncome =
                                                transaction.transaction_type_id ===
                                                1;
                                            const fallbackMemo = isIncome
                                                ? "収入の記録"
                                                : "支出の記録";

                                            return (
                                                <li
                                                    key={
                                                        transaction.transaction_id ??
                                                        index
                                                    }
                                                >
                                                    <button
                                                        type="button"
                                                        className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-background/75 sm:px-5"
                                                        onClick={() => {
                                                            setEditingTransaction(
                                                                transaction,
                                                            );
                                                            setEditModalOpen(
                                                                true,
                                                            );
                                                        }}
                                                    >
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <span
                                                                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                                                        isIncome
                                                                            ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                                                                            : "bg-rose-500/10 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
                                                                    }`}
                                                                >
                                                                    {isIncome
                                                                        ? "収入"
                                                                        : "支出"}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {formatDate(
                                                                        transaction.date,
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <p className="mt-3 truncate text-sm font-medium text-foreground sm:text-[15px]">
                                                                {transaction.memo ||
                                                                    fallbackMemo}
                                                            </p>
                                                        </div>
                                                        <div className="shrink-0 text-right">
                                                            <p
                                                                className={`text-base font-semibold ${
                                                                    isIncome
                                                                        ? "text-emerald-600 dark:text-emerald-300"
                                                                        : "text-rose-600 dark:text-rose-300"
                                                                }`}
                                                            >
                                                                {isIncome
                                                                    ? "+"
                                                                    : "-"}
                                                                ¥
                                                                {Math.abs(
                                                                    transaction.amount,
                                                                ).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </button>
                                                </li>
                                            );
                                        },
                                    )}
                                </ul>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-border/70 bg-background/60 px-4 py-10 text-center text-muted-foreground">
                                取引がありません
                            </div>
                        )}
                    </section>
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
