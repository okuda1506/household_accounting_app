"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
import { settingsInputClassName } from "../settings/SettingsPageShell";

type Props = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSuccess: () => void;
    category: Category;
};

export function EditCategoryModal({
    open,
    setOpen,
    onSuccess,
    category,
}: Props) {
    const [name, setName] = useState(category.name);
    const [errorMessage, setErrorMessage] = useState("");
    const modalFieldClassName = settingsInputClassName.replace("pl-11", "pl-3");

    // transaction_type_idは表示のみ（変更不可）
    const transactionType =
        category.transaction_type_id === 1 ? "income" : "expense";

    useEffect(() => {
        if (open) {
            setName(category.name);
            setErrorMessage("");
        }
    }, [open, category]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const res = await api.put(`/categories/${category.category_id}`, {
                user_id: category.user_id,
                name,
                transaction_type_id: category.transaction_type_id,
            });

            if (res.data.success) {
                setOpen(false);
                toast.success("カテゴリを更新しました");
                onSuccess();
            }
        } catch (err: any) {
            const messageArray = err.response?.data?.messages;
            if (Array.isArray(messageArray)) {
                setErrorMessage(messageArray.join(" "));
            } else {
                setErrorMessage("更新に失敗しました");
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="rounded-lg">
                <DialogHeader className="pr-10 text-center sm:text-center">
                    <DialogTitle>カテゴリ編集</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="type">取引タイプ</Label>
                        <Select value={transactionType} disabled>
                            <SelectTrigger className={modalFieldClassName}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="income">収入</SelectItem>
                                <SelectItem value="expense">支出</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="name">カテゴリ名</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={modalFieldClassName}
                        />
                    </div>

                    {errorMessage && (
                        <p className="text-sm text-red-400">{errorMessage}</p>
                    )}

                    <Button
                        type="submit"
                        className="h-12 w-full rounded-xl text-sm font-semibold shadow-lg shadow-primary/25"
                    >
                        更新
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
