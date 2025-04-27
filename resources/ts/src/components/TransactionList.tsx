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
        year: 2025,
        month: 4,
        date: "4月26日",
        description: "streamer coffee",
        amount: -1300,
    },
    {
        year: 2025,
        month: 4,
        date: "4月26日",
        description: "東京メトロ 飯田橋 → 溜池山王",
        amount: -178,
    },
    {
        year: 2025,
        month: 4,
        date: "4月26日",
        description: "東京メトロ 溜池山王 → 飯田橋",
        amount: -178,
    },
    {
        year: 2025,
        month: 4,
        date: "4月25日",
        description: "セブンイレブン",
        amount: -1300,
    },
    {
        year: 2025,
        month: 4,
        date: "4月25日",
        description: "給与",
        amount: +500000,
    },
    {
        year: 2025,
        month: 4,
        date: "4月24日",
        description: "セブンイレブン",
        amount: -2000,
    },
    {
        year: 2025,
        month: 4,
        date: "4月23日",
        description: "@cosme",
        amount: -5000,
    },
    {
        year: 2025,
        month: 4,
        date: "4月23日",
        description: "@cosme",
        amount: -5000,
    },
    {
        year: 2025,
        month: 4,
        date: "4月23日",
        description: "@cosme",
        amount: -5000,
    },
    {
        year: 2025,
        month: 4,
        date: "4月23日",
        description: "@cosme",
        amount: -5000,
    },
    {
        year: 2025,
        month: 4,
        date: "4月23日",
        description: "@cosme",
        amount: -5000,
    },
    {
        year: 2025,
        month: 4,
        date: "4月23日",
        description: "@cosme",
        amount: -5000,
    },
    {
        year: 2025,
        month: 4,
        date: "4月23日",
        description: "@cosme",
        amount: -5000,
    },
    {
        year: 2025,
        month: 4,
        date: "4月23日",
        description: "@cosme",
        amount: -5000,
    },
    {
        year: 2025,
        month: 4,
        date: "4月23日",
        description: "@cosme",
        amount: -5000,
    },
    {
        year: 2025,
        month: 4,
        date: "4月23日",
        description: "@cosme",
        amount: -5000,
    },
    {
        year: 2025,
        month: 4,
        date: "4月23日",
        description: "@cosme",
        amount: -5000,
    },
    {
        year: 2025,
        month: 4,
        date: "4月23日",
        description: "@cosme",
        amount: -5000,
    },
    {
        year: 2025,
        month: 4,
        date: "4月23日",
        description: "@cosme",
        amount: -5000,
    },
    {
        year: 2025,
        month: 4,
        date: "4月23日",
        description: "@cosme",
        amount: -5000,
    },
    {
        year: 2025,
        month: 4,
        date: "4月23日",
        description: "@cosme",
        amount: -5000,
    },
    {
        year: 2025,
        month: 4,
        date: "4月23日",
        description: "@cosme",
        amount: -5000,
    },
    {
        year: 2025,
        month: 4,
        date: "4/23",
        description: "@cosme",
        amount: -5000,
    },
    {
        year: 2025,
        month: 4,
        date: "4月23日",
        description: "@cosme",
        amount: -5000,
    },
    {
        year: 2025,
        month: 4,
        date: "4月1日",
        description: "4月定期券 神楽坂 ↔︎ 表参道",
        amount: -7891,
    },
    {
        year: 2024,
        month: 6,
        date: "6月15日",
        description: "スーパー",
        amount: -5000,
    },
    { year: 2024, month: 6, date: "6/14", description: "給与", amount: 350000 },
    {
        year: 2024,
        month: 5,
        date: "5月20日",
        description: "レストラン",
        amount: -8000,
    },
    {
        year: 2024,
        month: 5,
        date: "5月10日",
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
                                {[2025, 2024, 2023, 2022].map((year) => (
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
                <div className="flex justify-between items-center pb-10 p-0 rounded-lg">
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
