"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../lib/axios";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { PasswordInput } from "./ui/password-input";

export type DeleteAccountDialogProps = {
    open: boolean;
    onClose: () => void;
};

const passwordInputClassName =
    "h-12 rounded-xl border-border/70 bg-background/80 shadow-sm transition focus-visible:border-primary/40 focus-visible:ring-[3px] focus-visible:ring-primary/20 focus-visible:ring-offset-0 dark:bg-background/60";

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
        if (isSubmitting) {
            return;
        }

        if (!nextOpen) {
            setPassword("");
            setError(null);
            setIsSubmitting(false);
            onClose();
        }
    };

    const handleClose = () => {
        if (isSubmitting) {
            return;
        }

        handleOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px] rounded-lg">
                <DialogHeader className="pr-10 text-center sm:text-center">
                    <DialogTitle>アカウントを削除</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p className="text-center text-sm leading-6 text-muted-foreground">
                        この操作は元に戻せません。
                        <br />
                        続行するにはパスワードを入力してください。
                    </p>

                    <div className="space-y-2">
                        <Label htmlFor="password-confirm">パスワード</Label>
                        <PasswordInput
                            id="password-confirm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={passwordInputClassName}
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <p className="text-center text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    <div className="flex flex-col gap-3">
                        <Button
                            type="button"
                            className="h-12 w-full rounded-xl text-sm font-semibold"
                            variant="utility"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            キャンセル
                        </Button>
                        <Button
                            type="button"
                            className="h-12 w-full rounded-xl text-sm font-semibold shadow-lg shadow-red-500/20"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isSubmitting || !password}
                        >
                            {isSubmitting ? "削除中..." : "削除する"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteAccountDialog;
