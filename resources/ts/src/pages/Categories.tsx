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
import { ExpenseChart } from "../components/ExpenseChart";
import { NewCategoryModal } from "../components/NewCategoryModal";

export default function Categories() {
    return (
        <div className="min-h-screen bg-black text-white">
            <nav className="border-b border-gray-800">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <span className="text-xl font-semibold">
                            Categories
                        </span>
                        <NewCategoryModal />
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0 space-y-6">
                    <Card className="bg-black border-gray-800">
                        <CardHeader>
                            <div className="flex items-center justify-between w-full">
                                <CardTitle className="text-lg font-medium">
                                    一覧
                                </CardTitle>
                                <Select defaultValue="income">
                                    <SelectTrigger className="bg-gray-800 border-gray-700 w-[100px]">
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

                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
