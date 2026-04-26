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
import { DeleteCategoryModal } from "../components/category/DeleteCategoryModal";
import { AppHeader } from "../components/AppHeader";
import api from "../../lib/axios";
import type { Category } from "../types/categories";

const categoryCardClassName =
    "overflow-hidden rounded-[32px] border-border/70 bg-background/55 shadow-[0_32px_80px_-36px_rgba(15,23,42,0.45)] backdrop-blur-sm";

const categoryRowClassName =
    "flex cursor-pointer items-center justify-between rounded-2xl border border-border/60 bg-background/70 px-4 py-4 shadow-sm backdrop-blur-sm transition-colors hover:bg-background/90";

export default function Categories() {
    const [type, setType] = useState<"income" | "expense">("income");
    const [categories, setCategories] = useState<Category[]>([]);

    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null,
    );
    const [editModalOpen, setEditModalOpen] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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

    return (
        <div className="min-h-screen bg-background text-foreground">
            <AppHeader title="カテゴリ" />

            <main className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0 space-y-6">
                    <div className="fixed bottom-4 right-4 z-50">
                        <NewCategoryModal onSuccess={fetchCategories} />
                    </div>

                    <Card className={categoryCardClassName}>
                        <CardHeader className="space-y-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <CardTitle className="text-lg font-medium">
                                    カテゴリ一覧
                                </CardTitle>
                                <Select
                                    defaultValue="income"
                                    onValueChange={(val) =>
                                        setType(val as "income" | "expense")
                                    }
                                >
                                    <SelectTrigger className="h-10 w-[88px] rounded-xl border-border/60 bg-background/80 shadow-sm">
                                        <SelectValue placeholder="選択してください" />
                                    </SelectTrigger>
                                    <SelectContent>
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
                            {filteredCategories.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-border/70 bg-background/60 px-4 py-10 text-center text-sm text-muted-foreground">
                                    カテゴリを登録してください。
                                </div>
                            ) : (
                                <ul className="space-y-3">
                                    {filteredCategories.map((category) => (
                                        <li
                                            key={category.category_id}
                                            className={categoryRowClassName}
                                            onClick={() => {
                                                setEditingCategory(category);
                                                setEditModalOpen(true);
                                            }}
                                        >
                                            <p className="text-sm font-medium text-foreground">
                                                {category.name}
                                            </p>
                                            <Button
                                                variant="utility"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteTarget(category);
                                                    setDeleteModalOpen(true);
                                                }}
                                                className="ml-2 rounded-xl border border-border/50 bg-background/70 text-muted-foreground shadow-none hover:bg-background hover:text-red-500"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {editingCategory && (
                    <EditCategoryModal
                        open={editModalOpen}
                        setOpen={setEditModalOpen}
                        category={editingCategory}
                        onSuccess={fetchCategories}
                    />
                )}

                {deleteTarget && (
                    <DeleteCategoryModal
                        open={deleteModalOpen}
                        setOpen={setDeleteModalOpen}
                        category={deleteTarget}
                        onSuccess={fetchCategories}
                    />
                )}
            </main>
        </div>
    );
}
