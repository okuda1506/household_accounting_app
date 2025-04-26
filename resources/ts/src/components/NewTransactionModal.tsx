"use client";

import { useState } from "react";
import { Button } from "../components/ui/button";
import { DatePicker } from "../components/ui/date-picker";
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

    const [transactionDate, setTransactionDate] = useState<Date | undefined>(new Date());

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
                    className="bg-transparent text-white border-gray-700 hover:bg-gray-800"
                    size="circle"
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
                        <Label htmlFor="transaction-date">取引日</Label>
                        <DatePicker
                            date={transactionDate}
                            setDate={setTransactionDate}
                        />
                    </div>
                    {/* 取引タイプ */}
                    <div>
                        <Label htmlFor="type">取引タイプ</Label>
                        <Select defaultValue="income">
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue placeholder="選択してください" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 text-white">
                                <SelectItem value="income">収入</SelectItem>
                                <SelectItem value="expense">支出</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* カテゴリ */}
                    <div>
                        <Label htmlFor="type">カテゴリ</Label>
                        <Select defaultValue="給与">
                            <SelectTrigger className="bg-gray-800 border-gray-700text-white">
                                <SelectValue placeholder="選択してください" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 text-white">
                                <SelectItem value="給与">給与</SelectItem>
                                <SelectItem value="副収入">副収入</SelectItem>
                                <SelectItem value="その他">その他</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* 金額 */}
                    <div>
                        <Label htmlFor="amount">金額</Label>
                        <Input
                            id="amount"
                            type="number"
                            className="bg-gray-800 border-gray-700"
                        />
                    </div>
                    {/* 支払方法 */}
                    {/* todo: 取引タイプが支出の場合この項目は要るのか検討が必要 */}
                    <div>
                        <Label htmlFor="type">支払方法</Label>
                        <Select defaultValue="現金">
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue placeholder="選択してください" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 text-white">
                                <SelectItem value="現金">現金</SelectItem>
                                <SelectItem value="クレジットカード">クレジットカード</SelectItem>
                                <SelectItem value="銀行振込">銀行振込</SelectItem>
                                <SelectItem value="電子マネー">電子マネー</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* メモ */}
                    <div>
                        <Label htmlFor="description">メモ</Label>
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
