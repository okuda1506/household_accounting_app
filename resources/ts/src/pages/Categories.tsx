import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Trash2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { NewCategoryModal } from "../components/category/NewCategoryModal";
import { EditCategoryModal } from "../components/category/EditCategoryModal";
import { NavigationModal } from "../components/NavigationModal";
import api from "../../lib/axios";
import { Category } from "../types/categories";
import { toast } from "react-toastify";

export default function Categories() {
    const [type, setType] = useState<"income" | "expense">("income");
    const [categories, setCategories] = useState<Category[]>([]);

    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null
    );
    const [editModalOpen, setEditModalOpen] = useState(false);

    const fetchCategories = () => {
        api.get("/categories")
            .then((res) => {
                setCategories(res.data.data);
            })
            .catch((err) => {
                console.error("カテゴリの取得に失敗しました", err);
            });
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const filteredCategories = categories
        .filter((cat) => {
            if (type === "income") return cat.transaction_type_id === 1;
            return cat.transaction_type_id === 2;
        })
        .sort((a, b) => a.sort_no - b.sort_no);

    const handleDelete = async (id: string, name: string) => {
        try {
            await api.delete(`/categories/${id}`);
            toast.success(`${name} を削除しました。`);
            fetchCategories();
        } catch (err) {
            toast.error(`${name} の削除に失敗しました。`);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <nav className="border-b border-gray-800">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <span className="text-xl font-semibold">
                            카테고리 목록
                        </span>
                        <NavigationModal />
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0 space-y-6">
                    <div className="flex justify-end">
                        <NewCategoryModal onSuccess={fetchCategories} />
                    </div>

                    <Card className="bg-black border-gray-800">
                        <CardHeader>
                            <div className="flex items-center justify-between w-full">
                                <CardTitle className="text-lg font-medium">
                                    카테고리 목록
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
                                {filteredCategories.map((category) => (
                                    <li
                                        key={category.category_id}
                                        className="hover:bg-gray-700 rounded-md px-4 py-3 flex justify-between items-center"
                                        onClick={() => {
                                            setEditingCategory(category);
                                            setEditModalOpen(true);
                                        }}
                                    >
                                        <p className="text-sm font-medium">
                                            {category.name}
                                        </p>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation(); // 編集モーダルが開かないよう制御
                                                handleDelete(
                                                    category.category_id,
                                                    category.name
                                                );
                                            }}
                                            className="bg-transparent ml-2"
                                        >
                                            <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {editingCategory && (
                    <EditCategoryModal
                        open={editModalOpen}
                        setOpen={setEditModalOpen}
                        category={editingCategory}
                        onSuccess={() => {
                            fetchCategories();
                            setEditModalOpen(false);
                        }}
                    />
                )}
            </main>
        </div>
    );
}
