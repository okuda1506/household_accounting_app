import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { NewTransactionModal } from "../components/NewTransactionModal";
import { useState } from "react";
import { NavigationModal } from "../components/NavigationModal";

export default function Transactions() {

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
                    {/* <div className="flex justify-end"> */}
                    <div className="fixed bottom-6 right-6 z-50">
                        <NewTransactionModal />
                    </div>
                    <Card className="bg-black border-gray-800">
                        <CardHeader>
                            <div className="flex items-center justify-between w-full">
                                <CardTitle className="text-lg font-medium">
                                    取引一覧
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {[
                                // todo: 型定義するよう修正
                                    {
                                        date: "6/15",
                                        description: "スーパー",
                                        amount: -5000,
                                    },
                                    {
                                        date: "6/14",
                                        description: "給与",
                                        amount: 350000,
                                    },
                                    {
                                        date: "6/13",
                                        description: "レストラン",
                                        amount: -8000,
                                    },
                                    {
                                        date: "6/12",
                                        description: "電気代",
                                        amount: -12000,
                                    },
                                ].map((transaction, index) => (
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
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
