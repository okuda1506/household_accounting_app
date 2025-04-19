import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { ExpenseChart } from "../components/ExpenseChart";
import { NewTransactionModal } from "../components/NewTransactionModal";
import { NavigationModal } from "../components/NavigationModal";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-black text-white">
            <nav className="border-b border-gray-800">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <span className="text-xl font-semibold">Summary</span>
                        <NavigationModal />
                    </div>
                </div>
            </nav>
            <main className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0 space-y-6">
                    <div className="fixed bottom-4 right-4">
                        <NewTransactionModal />
                    </div>
                    <Card className="bg-black border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">
                                今月の収支情報
                            </CardTitle>
                            <p className="text-gray-400">2025年 3月</p>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center text-sm">
                                <div>
                                    <p className="text-gray-400">収入</p>
                                    <p className="text-xl font-semibold text-green-400">
                                        ¥500,000
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400">支出</p>
                                    <p className="text-xl font-semibold text-red-400">
                                        ¥280,000
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400">収支</p>
                                    <p className="text-xl font-semibold">
                                        ¥1,020,000
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <ExpenseChart />

                    <Card className="bg-black border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">
                                最近の取引
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {[
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
