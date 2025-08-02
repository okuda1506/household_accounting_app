"use client";

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
import { Category } from "../../types/categories";

export function NewTransactionModal() {
    const [open, setOpen] = useState(false);
    const [transactionType, setTransactionType] = useState<
        "income" | "expense"
    >("income");
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [payment, setPayment] = useState("");
    const [description, setDescription] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [transactionDate, setTransactionDate] = useState<Date | undefined>(
        new Date()
    );
    const [allCategories, setAllCategories] = useState<Category[]>([]);

    useEffect(() => {
        if (open) {
            const fetchCategories = async () => {
                try {
                    const res = await api.get("/categories");
                    setAllCategories(res.data.data);
                } catch (err) {
                    toast.error("カテゴリの取得に失敗しました。");
                }
            };
            fetchCategories();
        }
    }, [open]);

    // 取引タイプが変更されたら、カテゴリの選択をリセット
    useEffect(() => {
        setCategory("");
    }, [transactionType]);

    const filteredCategories = allCategories.filter(
        (c) =>
            c.transaction_type_id === (transactionType === "income" ? 1 : 2)
    );

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const transaction_type_id = transactionType === "income" ? 1 : 2;

        try {
            const res = await api.post("/transactions", {
                transaction_date: transactionDate?.toISOString(), //todo: 要確認
                transaction_type_id,
                category_id: Number(category),
                amount: Number(amount),
                payment_method_id: payment,
                memo: description,
            });

            if (res.data.success) {
                setOpen(false);
                setTransactionType("income");
                setCategory("");
                setAmount("");
                setPayment("");
                setDescription("");
                setTransactionDate(new Date());
                setErrorMessage("");
                toast.success("取引を登録しました");
            }
        } catch (err: any) {
            const messageArray = err.response?.data?.messages;
            if (Array.isArray(messageArray)) {
                setErrorMessage(messageArray.join(" "));
            } else {
                setErrorMessage("登録に失敗しました。");
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="bg-transparent text-white border-gray-700 hover:bg-gray-800"
                    size="circle"
                >
                    ＋
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white">
                <DialogHeader>
                    <DialogTitle>新規取引</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="transaction-date">取引日</Label>
                        <DatePicker
                            date={transactionDate}
                            setDate={setTransactionDate}
                        />
                    </div>
                    {/* 取引タイプ */}
                    <div>
                        <Label htmlFor="type">取引タイプ</Label>
                        <Select
                            value={transactionType}
                            onValueChange={(val) =>
                                setTransactionType(val as "income" | "expense")
                            }
                        >
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue placeholder="選択してください" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 text-white">
                                <SelectItem value="income">収入</SelectItem>
                                <SelectItem value="expense">支出</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* カテゴリ */}
                    <div>
                        <Label htmlFor="category">カテゴリ</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue placeholder="選択してください" />
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
                        <Label htmlFor="amount">金額</Label>
                        <Input
                            id="amount"
                            type="number"
                            className="bg-gray-800 border-gray-700"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    {/* 支払方法 */}
                    {/* todo: 支払方法も動的に取得・表示するように修正する */}
                    <div>
                        <Label htmlFor="type">支払方法</Label>
                        <Select defaultValue="現金">
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue placeholder="選択してください" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 text-white">
                                <SelectItem value="現金">現金</SelectItem>
                                <SelectItem value="クレジットカード">
                                    クレジットカード
                                </SelectItem>
                                <SelectItem value="銀行振込">
                                    銀行振込
                                </SelectItem>
                                <SelectItem value="電子マネー">
                                    電子マネー
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* メモ */}
                    <div>
                        <Label htmlFor="description">メモ</Label>
                        <Input
                            id="description"
                            className="bg-gray-800 border-gray-700"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {errorMessage && (
                        <p className="text-sm text-red-400">{errorMessage}</p>
                    )}

                    <Button type="submit" className="w-full">
                        追加
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
