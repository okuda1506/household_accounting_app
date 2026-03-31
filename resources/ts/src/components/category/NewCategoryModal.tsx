"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { settingsInputClassName } from "../settings/SettingsPageShell";

type Props = {
    onSuccess: () => void;
};

export function NewCategoryModal({ onSuccess }: Props) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [type, setType] = useState<"income" | "expense">("income");
    const [errorMessage, setErrorMessage] = useState("");
    const modalFieldClassName = settingsInputClassName.replace("pl-11", "pl-3");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const transaction_type_id = type === "income" ? 1 : 2;

        try {
            const res = await api.post("/categories", {
                name,
                transaction_type_id,
            });

            if (res.data.success) {
                setOpen(false);
                setName("");
                setType("income");
                setErrorMessage("");
                toast.success("カテゴリを登録しました");
                onSuccess();
            }
        } catch (err: any) {
            const messageArray = err.response?.data?.messages;
            if (Array.isArray(messageArray)) {
                setErrorMessage(messageArray.join(" "));
            } else {
                setErrorMessage("登録に失敗しました。");
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="utility"
                    size="circle"
                    className="bg-background/60"
                >
                    ＋
                </Button>
            </DialogTrigger>
            <DialogContent className="rounded-lg">
                <DialogHeader className="pr-10 text-center sm:text-center">
                    <DialogTitle>カテゴリ登録</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="type">取引タイプ</Label>
                        <Select
                            value={type}
                            onValueChange={(val) =>
                                setType(val as "income" | "expense")
                            }
                        >
                            <SelectTrigger className={modalFieldClassName}>
                                <SelectValue placeholder="選択してください" />
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
                            onClear={() => setName("")}
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
                        登録
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
