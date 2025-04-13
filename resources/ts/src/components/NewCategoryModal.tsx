"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

export function NewCategoryModal() {
    const [open, setOpen] = useState(false);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // ここで新しい取引を追加するロジックを実装します
        console.log("新しい取引が追加されました");
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="text-white border-gray-700 hover:bg-gray-800"
                >
                    新規
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white">
                <DialogHeader>
                    <DialogTitle>カテゴリ登録</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="type">取引タイプ</Label>
                        <Select defaultValue="income">
                            <SelectTrigger className="bg-gray-800 border-gray-700">
                                <SelectValue placeholder="選択してください" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800">
                                <SelectItem value="income">収入</SelectItem>
                                <SelectItem value="expense">支出</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="description">カテゴリ名</Label>
                        <Input
                            id="description"
                            className="bg-gray-800 border-gray-700"
                        />
                    </div>
                    <Button type="submit" className="w-full">
                        追加
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
