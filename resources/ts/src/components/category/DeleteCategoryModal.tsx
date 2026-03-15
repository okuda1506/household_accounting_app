"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import api from "../../../lib/axios";
import { toast } from "react-toastify";
import type { Category } from "../../types/categories";

type Props = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSuccess: () => void;
    category: Category;
};

export function DeleteCategoryModal({
    open,
    setOpen,
    onSuccess,
    category,
}: Props) {
    const [errorMessage, setErrorMessage] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (open) {
            setErrorMessage("");
        }
    }, [open, category]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            setIsDeleting(true);

            const res = await api.delete(`/categories/${category.category_id}`);

            if (res.data.success) {
                setOpen(false);
                toast.success(`${category.name} を削除しました。`);
                onSuccess();
            }
        } catch (err: any) {
            const messageArray = err.response?.data?.messages;
            if (Array.isArray(messageArray)) {
                setErrorMessage(messageArray.join(" "));
            } else {
                setErrorMessage("削除に失敗しました");
            }
        } finally {
            setIsDeleting(false);
        }
    };

    const handleClose = () => {
        if (isDeleting) return;
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (isDeleting) return;
                setOpen(nextOpen);
            }}
        >
            <DialogContent className="bg-gray-900 text-white rounded-lg">
                <DialogHeader>
                    <DialogTitle>カテゴリ削除</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-sm text-gray-300 leading-6 text-center">
                        <span className="font-semibold text-white">
                            {category.name}
                        </span>{" "}
                        を削除します。
                        <br />
                        この操作は取り消せません。
                    </p>

                    <p className="text-xs text-gray-500 text-center">
                        ※ 取引に登録済みのカテゴリは削除できません
                    </p>

                    {errorMessage && (
                        <p className="text-sm text-red-400 text-center">
                            {errorMessage}
                        </p>
                    )}

                    <div className="flex flex-col gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full bg-transparent border-gray-700 text-white hover:bg-gray-800 hover:text-white"
                            onClick={handleClose}
                            disabled={isDeleting}
                        >
                            キャンセル
                        </Button>
                        <Button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "削除中..." : "削除する"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
