"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
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
import { Transaction } from "../../types/transactions";

type Props = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSuccess: () => void;
    transaction: Transaction;
};

export function EditTransactionModal({
    open,
    setOpen,
    onSuccess,
    transaction,
}: Props) {
    // todo: formの初期値をtransactionから取得
    // const [name, setName] = useState(transaction.name);
    const [errorMessage, setErrorMessage] = useState("");

    // transaction_type_idは表示のみ（変更不可）
    const transactionType =
        transaction.transaction_type_id === 1 ? "income" : "expense";

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const res = await api.put(`/transactions/${transaction.transaction_id}`, {
                user_id: transaction.user_id,
                transaction_type_id: transaction.transaction_type_id,
            });

            if (res.data.success) {
                setOpen(false);
                toast.success("取引を更新しました");
                onSuccess();
            }
        } catch (err: any) {
            const messageArray = err.response?.data?.messages;
            if (Array.isArray(messageArray)) {
                setErrorMessage(messageArray.join(" "));
            } else {
                setErrorMessage("更新に失敗しました。");
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="bg-gray-900 text-white">
                <DialogHeader>
                    <DialogTitle>取引編集</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="type">取引タイプ</Label>
                        <Select value={transactionType} disabled>
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 text-white">
                                <SelectItem value="income">収入</SelectItem>
                                <SelectItem value="expense">支出</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* <div>
                        <Label htmlFor="name">カテゴリ</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-gray-800 border-gray-700"
                        />
                    </div> */}

                    {errorMessage && (
                        <p className="text-sm text-red-400">{errorMessage}</p>
                    )}

                    <Button type="submit" className="w-full">
                        更新
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
