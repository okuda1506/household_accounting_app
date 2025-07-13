import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import api from "../../lib/axios";
import { Transaction } from "../types/transactions";
import { toast } from "react-toastify";

export function TransactionList() {
    const now = new Date();
    const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(
        now.getMonth() + 1
    );
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const fetchTransactions = async () => {
        try {
            const res = await api.get("/transactions");
            const rawTransactions = res.data.data;

            const parsedTransactions: Transaction[] = rawTransactions.map(
                (t: any) => {
                    const date = new Date(t.transaction_date);
                    return {
                        transaction_id:
                            t.transaction_id ??
                            `${t.user_id}-${t.transaction_date}`, // 適当なユニークキーを生成
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

    // 取引年の選択肢を動的に生成する
    const years = Array.from(new Set(transactions.map((t) => t.year))).sort(
        (a, b) => b - a
    );

    const filteredTransactions = transactions.filter(
        (transaction) =>
            transaction.year === selectedYear &&
            transaction.month === selectedMonth
    );

    return (
        <Card className="bg-black border-gray-800">
            <CardHeader>
                <div className="flex items-center justify-between w-full">
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
                            <SelectTrigger className="w-[100px] text-white">
                                <SelectValue placeholder="年" />
                            </SelectTrigger>
                            <SelectContent className="bg-black text-white">
                                {years.map((year) => (
                                    <SelectItem key={year} value={String(year)}>
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
                            <SelectTrigger className="w-[100px] text-white">
                                <SelectValue placeholder="月" />
                            </SelectTrigger>
                            <SelectContent className="bg-black text-white">
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

            <CardContent>
                <div className="flex justify-between items-center pb-10">
                    <p className="text-white text-lg">
                        収入：
                        <span className="text-green-400 font-medium ml-2">
                            ¥
                            {filteredTransactions
                                .filter((t) => t.amount > 0)
                                .reduce((sum, t) => sum + t.amount, 0)
                                .toLocaleString()}
                        </span>
                    </p>
                    <p className="text-white text-lg">
                        支出：
                        <span className="text-red-400 font-medium ml-2">
                            ¥
                            {Math.abs(
                                filteredTransactions
                                    .filter((t) => t.amount < 0)
                                    .reduce((sum, t) => sum + t.amount, 0)
                            ).toLocaleString()}
                        </span>
                    </p>
                </div>

                {filteredTransactions.length > 0 ? (
                    <ul className="space-y-4">
                        {filteredTransactions.map((transaction) => (
                            <li
                                key={transaction.transaction_id}
                                className="flex justify-between items-center text-sm"
                            >
                                <div>
                                    <p className="font-medium">
                                        {transaction.memo}
                                    </p>
                                    <p className="text-gray-400">
                                        {transaction.year}年{transaction.month}
                                        月{transaction.day}日
                                    </p>
                                </div>
                                <p
                                    className={`font-medium ${
                                        transaction.amount > 0
                                            ? "text-green-400"
                                            : "text-red-400"
                                    }`}
                                >
                                    {transaction.amount > 0 ? "+" : "-"}¥
                                    {Math.abs(
                                        transaction.amount
                                    ).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 text-center py-4">
                        取引がありません
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
