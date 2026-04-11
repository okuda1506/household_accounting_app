"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../lib/axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

export type SignOutDialogProps = {
    open: boolean;
    onClose: () => void;
};

const SignOutDialog = ({ open, onClose }: SignOutDialogProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSignOut = async () => {
        setIsSubmitting(true);

        try {
            const response = await api.post("/logout");
            localStorage.removeItem("access_token");
            toast.success(response.data.message);
            onClose();
            navigate("/login", { replace: true });
        } catch (error) {
            toast.error("サインアウトに失敗しました。");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (isSubmitting) {
            return;
        }

        if (!nextOpen) {
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
                    <DialogTitle>サインアウト</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p className="text-center text-sm leading-6 text-muted-foreground">
                        現在のセッションを終了して
                        <br />
                        ログイン画面へ戻ります。
                    </p>

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
                            onClick={handleSignOut}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "サインアウト中..." : "サインアウト"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SignOutDialog;
