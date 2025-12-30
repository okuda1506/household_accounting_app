"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../lib/axios";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export type DeleteAccountDialogProps = {
    open: boolean;
    onClose: () => void;
};

const DeleteAccountDialog = ({ open, onClose }: DeleteAccountDialogProps) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleDelete = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await api.delete("/delete-user", {
                data: { password },
            });

            toast.success(
                response.data.message || "アカウントを削除しました。"
            );
            localStorage.removeItem("access_token");
            onClose();
            navigate("/login", { replace: true });
        } catch (err: any) {
            if (
                err.response?.status === 422 &&
                err.response.data.errors?.password
            ) {
                setError(err.response.data.errors.password[0]);
            } else {
                toast.error(
                    err.response?.data?.message ||
                        "アカウントの削除に失敗しました。"
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            setPassword("");
            setError(null);
            setIsSubmitting(false);
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-black border-gray-800 text-white rounded-lg">
                <DialogHeader>
                    <DialogTitle>アカウントを削除</DialogTitle>
                    <DialogDescription className="text-gray-400 !mt-5">
                        この操作は元に戻せません。続行するにはパスワードを入力してください。
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-2">
                    <Label htmlFor="password-confirm" className="text-white">
                        パスワード
                    </Label>
                    <Input
                        id="password-confirm"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-900 border-gray-700 focus:ring-indigo-500"
                        autoComplete="current-password"
                    />
                    {error && (
                        <p className="text-red-500 text-sm pt-1">{error}</p>
                    )}
                </div>
                <DialogFooter className="gap-2">
                    <Button
                        className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        キャンセル
                    </Button>
                    <Button
                        className="w-full"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isSubmitting || !password}
                    >
                        {isSubmitting ? "削除中..." : "削除"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteAccountDialog;
