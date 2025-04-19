"use client";

import { useState } from "react";
import { Button } from "../components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";

export function NewTransactionModal() {
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
                    ＋
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white">
                <DialogHeader>
                    <DialogTitle>新規取引</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="description">説明</Label>
                        <Input
                            id="description"
                            className="bg-gray-800 border-gray-700"
                        />
                    </div>
                    <div>
                        <Label htmlFor="amount">金額</Label>
                        <Input
                            id="amount"
                            type="number"
                            className="bg-gray-800 border-gray-700"
                        />
                    </div>
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
                        <Label htmlFor="type">カテゴリ</Label>
                        <Select defaultValue="給与">
                            <SelectTrigger className="bg-gray-800 border-gray-700">
                                <SelectValue placeholder="選択してください" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800">
                                <SelectItem value="給与">給与</SelectItem>
                                <SelectItem value="副収入">副収入</SelectItem>
                                <SelectItem value="その他">その他</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" className="w-full">
                        追加
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
