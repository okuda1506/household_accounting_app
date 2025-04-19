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
import { NewCategoryModal } from "../components/NewCategoryModal";
import { useState } from "react";
import { NavigationModal } from "../components/NavigationModal";

export default function Transactions() {
    const [type, setType] = useState<"income" | "expense">("income");

    // 仮のカテゴリデータ（後でAPI連携も可能）
    const categories = {
        income: ["給与", "副業", "配当金"],
        expense: ["食費", "家賃", "光熱費"],
    };

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
                    <div className="flex justify-end">
                        <NewCategoryModal />
                    </div>
                    <Card className="bg-black border-gray-800">
                        <CardHeader>
                            <div className="flex items-center justify-between w-full">
                                <CardTitle className="text-lg font-medium">
                                    取引一覧
                                </CardTitle>
                                <Select
                                    defaultValue="income"
                                    onValueChange={(val) =>
                                        setType(val as "income" | "expense")
                                    }
                                >
                                    <SelectTrigger className="bg-gray-800 border-gray-700 w-[80px]">
                                        <SelectValue placeholder="選択してください" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800">
                                        <SelectItem value="income">
                                            収入
                                        </SelectItem>
                                        <SelectItem value="expense">
                                            支出
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <ul className="space-y-3">
                                {categories[type].map((category, index) => (
                                    <li
                                        key={index}
                                        className="hover:bg-gray-700 rounded-md px-4 py-3 cursor-pointer transition"
                                        // onClick={() => handleCategoryClick(category)} // 関数は後述
                                    >
                                        <p className="text-sm font-medium">
                                            {category}
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
