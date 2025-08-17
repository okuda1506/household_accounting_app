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
    DialogTrigger,
} from "../ui/dialog";
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
import { Transaction } from "../../types/transactions";
import { Category } from "../../types/categories";
import { PaymentMethod } from "../../types/paymentMethod";

type Props = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSuccess: () => void;
    transaction: Transaction;
};

export function EditTransactionModal({
    open,
    setOpen,
    onSuccess,
    transaction,
}: Props) {
    const [category, setCategory] = useState(String(transaction.category_id));
    // 金額はUI上では常に正の数として扱う
    const [amount, setAmount] = useState(Math.abs(transaction.amount));
    const [paymentMethod, setPaymentMethod] = useState(
        String(transaction.payment_method_id)
    );
    const [description, setDescription] = useState(transaction.memo);
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    const [transactionDate, setTransactionDate] = useState<Date | undefined>(
        new Date(transaction.date)
    );
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [allPaymentMethods, setAllPaymentMethods] = useState<PaymentMethod[]>(
        []
    );
    const TRANSACTION_TYPE_IDS = {
        INCOME: 1,
        EXPENSE: 2,
    } as const;

    // transaction_type_idは表示のみ（変更不可）
    const transactionType =
        transaction.transaction_type_id === 1 ? "income" : "expense";

    useEffect(() => {
        if (open) {
            const fetchInitialData = async () => {
                try {
                    const [categoriesRes, paymentMethodsRes] =
                        await Promise.all([
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
        }
    }, [open]);

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
            if (
                err.response &&
                err.response.status === 422 &&
                Array.isArray(err.response.data.messages)
            ) {
                const newErrors: { [key: string]: string[] } = {};
                const errorMessages: string[] = err.response.data.messages;

                // エラーメッセージをキーワードで振り分ける
                errorMessages.forEach((msg) => {
                    if (msg.includes("取引日")) {
                        newErrors.transaction_date = [msg];
                    } else if (msg.includes("タイプ")) {
                        newErrors.transaction_type_id = [msg];
                    } else if (msg.includes("カテゴリ")) {
                        newErrors.category_id = [msg];
                    } else if (msg.includes("金額")) {
                        newErrors.amount = [msg];
                    } else if (msg.includes("支払方法")) {
                        newErrors.payment_method_id = [msg];
                    } else {
                        // どのキーワードにも一致しないエラー
                        newErrors.general = [...(newErrors.general || []), msg];
                    }
                });
                setErrors(newErrors);
            } else {
                setErrors({ general: ["登録に失敗しました。"] });
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="bg-gray-900 text-white">
                <DialogHeader>
                    <DialogTitle>取引編集</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <Label htmlFor="transaction-date">取引日</Label>
                            <p className="h-5 text-sm text-red-400 text-right">
                                {errors.transaction_date?.[0]}
                            </p>
                        </div>
                        <DatePicker
                            date={transactionDate}
                            setDate={setTransactionDate}
                        />
                    </div>
                    {/* 取引タイプ */}
                    <div>
                        <Label htmlFor="type">取引タイプ</Label>
                        <Select value={transactionType} disabled>
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 text-white">
                                <SelectItem value="income">収入</SelectItem>
                                <SelectItem value="expense">支出</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* カテゴリ */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <Label htmlFor="category">カテゴリ</Label>
                            <p className="h-5 text-sm text-red-400 text-right">
                                {errors.category_id?.[0]}
                            </p>
                        </div>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger
                                className={`bg-gray-800 border-gray-700 text-white ${
                                    errors.category_id ? "border-red-500" : ""
                                }`}
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 text-white">
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
                    {/* 金額 */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <Label htmlFor="amount">金額</Label>
                            <p className="h-5 text-sm text-red-400 text-right">
                                {errors.amount?.[0]}
                            </p>
                        </div>
                        <Input
                            id="amount"
                            type="number"
                            className={`bg-gray-800 border-gray-700 ${
                                errors.amount ? "border-red-500" : ""
                            }`}
                            value={amount}
                            onChange={(e) =>
                                setAmount(Number(e.target.value))
                            }
                        />
                    </div>
                    {/* 支払方法 */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <Label htmlFor="payment-method">支払方法</Label>
                            <p className="h-5 text-sm text-red-400 text-right">
                                {errors.payment_method_id?.[0]}
                            </p>
                        </div>
                        <Select
                            value={paymentMethod}
                            onValueChange={setPaymentMethod}
                        >
                            <SelectTrigger
                                className={`bg-gray-800 border-gray-700 text-white ${
                                    errors.payment_method_id
                                        ? "border-red-500"
                                        : ""
                                }`}
                            >
                                <SelectValue placeholder="支払方法を選択..." />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 text-white">
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
                    {/* メモ */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <Label htmlFor="description">メモ</Label>
                            <p className="h-5 text-sm text-red-400 text-right">
                                {errors.memo?.[0]}
                            </p>
                        </div>
                        <Input
                            id="description"
                            className={`bg-gray-800 border-gray-700 ${
                                errors.memo ? "border-red-500" : ""
                            }`}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {errors.general && (
                        <div className="text-sm text-red-400 space-y-1">
                            {errors.general.map((msg, index) => (
                                <p key={index}>{msg}</p>
                            ))}
                        </div>
                    )}

                    <Button type="submit" className="w-full">
                        更新
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
