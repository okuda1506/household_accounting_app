"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Bars3Icon as MenuIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import { toast } from "react-toastify";

export function NavigationModal() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const closeModal = () => {
        setOpen(false);
    };

    const handleLogout = async () => {
        closeModal();
        try {
            const response = await api.post("/logout");
            localStorage.removeItem("access_token");
            toast.success(response.data.message);
            navigate("/login", { replace: true });
        } catch (error) {
            toast.error("サインアウトに失敗しました。");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="text-white border-gray-700 hover:bg-gray-800"
                >
                    <MenuIcon className="h-6 w-6" />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white">
                <DialogHeader>
                    <DialogTitle>メニュー</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Link
                        to="/"
                        className="flex items-center justify-center rounded-md px-4 py-3 hover:bg-gray-800"
                        onClick={closeModal}
                    >
                        <span>ダッシュボード</span>
                    </Link>
                    <Link
                        to="/categories"
                        className="flex items-center justify-center rounded-md px-4 py-3 hover:bg-gray-800"
                        onClick={closeModal}
                    >
                        <span>カテゴリ</span>
                    </Link>
                    <Link
                        to="/transactions"
                        className="flex items-center justify-center rounded-md px-4 py-3 hover:bg-gray-800"
                        onClick={closeModal}
                    >
                        <span>取引</span>
                    </Link>
                    <Link
                        to="/settings"
                        className="flex items-center justify-center rounded-md px-4 py-3 hover:bg-gray-800"
                        onClick={closeModal}
                    >
                        <span>設定</span>
                    </Link>
                </div>
            </DialogContent>
        </Dialog>
    );
}
