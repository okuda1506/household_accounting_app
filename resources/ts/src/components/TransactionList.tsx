import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

type Transaction = {
    date: string; // "6/15" とか
    description: string; // "スーパー" とか
    amount: number; // 金額
    year: number; // 年（例：2024）
    month: number; // 月（例：6）
};

const transactions: Transaction[] = [
    {
        year: 2024,
        month: 6,
        date: "6/15",
        description: "スーパー",
        amount: -5000,
    },
    { year: 2024, month: 6, date: "6/14", description: "給与", amount: 350000 },
    {
        year: 2024,
        month: 5,
        date: "5/20",
        description: "レストラン",
        amount: -8000,
    },
    {
        year: 2024,
        month: 5,
        date: "5/10",
        description: "電気代",
        amount: -12000,
    },
];

export function TransactionList() {
    const now = new Date();
    const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(
        now.getMonth() + 1
    ); // getMonth()は0始まりなので+1する

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
                        取引一覧
                    </CardTitle>
                </div>
                <div className="flex gap-2 mt-4">
                    <Select
                        onValueChange={(value) =>
                            setSelectedYear(Number(value))
                        }
                        value={String(selectedYear)}
                    >
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="年" />
                        </SelectTrigger>
                        <SelectContent>
                            {[2024, 2023, 2022].map((year) => (
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
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="月" />
                        </SelectTrigger>
                        <SelectContent>
                            {[...Array(12)].map((_, i) => (
                                <SelectItem key={i + 1} value={String(i + 1)}>
                                    {i + 1}月
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>

            <CardContent>
                {filteredTransactions.length > 0 ? (
                    <ul className="space-y-4">
                        {filteredTransactions.map((transaction, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center text-sm"
                            >
                                <div>
                                    <p className="font-medium">
                                        {transaction.description}
                                    </p>
                                    <p className="text-gray-400">
                                        {transaction.date}
                                    </p>
                                </div>
                                <p
                                    className={`font-medium ${
                                        transaction.amount > 0
                                            ? "text-green-400"
                                            : "text-red-400"
                                    }`}
                                >
                                    {transaction.amount > 0 ? "+" : ""}¥
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
