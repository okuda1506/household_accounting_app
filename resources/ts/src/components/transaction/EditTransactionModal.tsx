"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { DatePicker } from "../ui/date-picker";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import api from "../../../lib/axios";
import { toast } from "react-toastify";
import { extractFieldErrors, type FieldErrors } from "../../../lib/error-response";
import { Transaction } from "../../types/transactions";
import { Category } from "../../types/categories";
import { PaymentMethod } from "../../types/paymentMethod";

type Props = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSuccess: () => void;
    transaction: Transaction;
    allCategories: Category[];
    allPaymentMethods: PaymentMethod[];
};

export function EditTransactionModal({
    open,
    setOpen,
    onSuccess,
    transaction,
    allCategories,
    allPaymentMethods,
}: Props) {
    const [category, setCategory] = useState(String(transaction.category_id));
    // 金額はUI上では常に正の数として扱う
    const [amount, setAmount] = useState(String(Math.abs(transaction.amount)));
    const [paymentMethod, setPaymentMethod] = useState(
        String(transaction.payment_method_id)
    );
    const [description, setDescription] = useState(transaction.memo);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [transactionDate, setTransactionDate] = useState<Date | undefined>(
        new Date(transaction.date)
    );
    const TRANSACTION_TYPE_IDS = {
        INCOME: 1,
        EXPENSE: 2,
    } as const;

    // transaction_type_idは表示のみ（変更不可）
    const transactionType =
        transaction.transaction_type_id === 1 ? "income" : "expense";
    const transactionTypeLabel = transactionType === "income" ? "収入" : "支出";

    useEffect(() => {
        if (open) {
            setCategory(String(transaction.category_id));
            setAmount(String(Math.abs(transaction.amount)));
            setPaymentMethod(String(transaction.payment_method_id));
            setDescription(transaction.memo);
            setTransactionDate(new Date(transaction.date));
            setErrors({});
        }
    }, [open, transaction]);

    const filteredCategories = allCategories.filter(
        (c) =>
            c.transaction_type_id ===
            (transactionType === "income"
                ? TRANSACTION_TYPE_IDS.INCOME
                : TRANSACTION_TYPE_IDS.EXPENSE)
    );

    const filteredPaymentMethods = allPaymentMethods.filter(
        (p) =>
            p.transaction_type_id ===
            (transactionType === "income"
                ? TRANSACTION_TYPE_IDS.INCOME
                : TRANSACTION_TYPE_IDS.EXPENSE)
    );

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const transaction_type_id =
            transactionType === "income"
                ? TRANSACTION_TYPE_IDS.INCOME
                : TRANSACTION_TYPE_IDS.EXPENSE;

        const formattedDate = transactionDate
            ? format(transactionDate, "yyyy-MM-dd HH:mm:ss")
            : undefined;

        try {
            const res = await api.put(
                `/transactions/${transaction.transaction_id}`,
                {
                    transaction_date: formattedDate,
                    transaction_type_id,
                    category_id: Number(category),
                    amount: Number(amount),
                    payment_method_id: Number(paymentMethod),
                    memo: description,
                }
            );

            if (res.data.success) {
                setOpen(false);
                toast.success("取引を更新しました");
                onSuccess();
            }
        } catch (err: any) {
            setErrors(extractFieldErrors(err, "更新に失敗しました。"));
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/transactions/${transaction.transaction_id}`);
            toast.success("取引を削除しました。");
            onSuccess();
            setOpen(false);
        } catch (err) {
            toast.error("取引の削除に失敗しました。");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-h-[calc(100dvh-1rem)] max-w-lg overflow-hidden rounded-lg p-0">
                <DialogHeader className="shrink-0 px-4 pb-3 pt-5 pr-12 text-center sm:px-6 sm:pb-4 sm:pt-6 sm:text-center">
                    <DialogTitle>取引編集</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
                    <div className="min-h-0 space-y-3 overflow-y-auto px-4 py-4 sm:space-y-4 sm:px-6 sm:py-5">
                        <div className="space-y-2">
                            <div className="flex items-start justify-between gap-3">
                            <Label htmlFor="transaction-date">取引日</Label>
                                {errors.transaction_date?.[0] && (
                                    <p className="text-right text-sm text-red-400">
                                        {errors.transaction_date[0]}
                                    </p>
                                )}
                            </div>
                            <DatePicker
                                date={transactionDate}
                                setDate={setTransactionDate}
                                className={
                                    errors.transaction_date
                                        ? "border-red-500"
                                        : ""
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">取引タイプ</Label>
                            <div className="flex h-10 items-center rounded-xl border border-border/70 bg-background/70 px-3 text-sm text-foreground/80">
                                {transactionTypeLabel}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-start justify-between gap-3">
                            <Label htmlFor="category">カテゴリ</Label>
                                {errors.category_id?.[0] && (
                                    <p className="text-right text-sm text-red-400">
                                        {errors.category_id[0]}
                                    </p>
                                )}
                            </div>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger
                                    className={`${
                                        errors.category_id
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredCategories.map((cat) => (
                                        <SelectItem
                                            key={cat.category_id}
                                            value={String(cat.category_id)}
                                        >
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-start justify-between gap-3">
                            <Label htmlFor="amount">金額</Label>
                                {errors.amount?.[0] && (
                                    <p className="text-right text-sm text-red-400">
                                        {errors.amount[0]}
                                    </p>
                                )}
                            </div>
                            <Input
                                id="amount"
                                type="number"
                                className={`focus-visible:ring-indigo-500 ${
                                    errors.amount ? "border-red-500" : ""
                                }`}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                onClear={() => setAmount("")}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-start justify-between gap-3">
                            <Label htmlFor="payment-method">支払方法</Label>
                                {errors.payment_method_id?.[0] && (
                                    <p className="text-right text-sm text-red-400">
                                        {errors.payment_method_id[0]}
                                    </p>
                                )}
                            </div>
                            <Select
                                value={paymentMethod}
                                onValueChange={setPaymentMethod}
                            >
                                <SelectTrigger
                                    className={`${
                                        errors.payment_method_id
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                >
                                    <SelectValue placeholder="支払方法を選択..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredPaymentMethods.map((pay) => (
                                        <SelectItem
                                            key={pay.payment_method_id}
                                            value={String(pay.payment_method_id)}
                                        >
                                            {pay.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-start justify-between gap-3">
                            <Label htmlFor="description">メモ</Label>
                                {errors.memo?.[0] && (
                                    <p className="text-right text-sm text-red-400">
                                        {errors.memo[0]}
                                    </p>
                                )}
                            </div>
                            <Input
                                id="description"
                                className={`focus-visible:ring-indigo-500 ${
                                    errors.memo ? "border-red-500" : ""
                                }`}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                onClear={() => setDescription("")}
                            />
                        </div>

                        {errors.general && (
                            <div className="space-y-1 text-sm text-red-400">
                                {errors.general.map((msg, index) => (
                                    <p key={index}>{msg}</p>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="shrink-0 px-4 pb-4 pt-3 sm:px-6 sm:pb-6 sm:pt-4">
                        <div className="grid grid-cols-2 gap-3">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        className="h-12 w-full rounded-xl text-sm font-semibold shadow-lg shadow-red-500/20"
                                    >
                                        削除
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="border-border">
                                    <AlertDialogHeader className="text-center sm:text-center">
                                        <AlertDialogTitle>
                                            本当に削除しますか？
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            この操作は元に戻せません。
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="mt-2 h-12 rounded-xl border border-border bg-background/80 text-sm font-semibold text-foreground shadow-sm backdrop-blur-sm hover:bg-accent hover:text-accent-foreground sm:mt-0">
                                            キャンセル
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            className="h-12 rounded-xl bg-red-600 text-sm font-semibold shadow-lg shadow-red-500/20 hover:bg-red-700"
                                        >
                                            削除
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <Button
                                type="submit"
                                className="h-12 w-full rounded-xl text-sm font-semibold shadow-lg shadow-primary/25"
                            >
                                更新
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
