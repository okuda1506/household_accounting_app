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
import { Bars3Icon as MenuIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export function NavigationModal() {
    const [open, setOpen] = useState(false);

    const closeModal = () => {
        setOpen(false);
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
                        className="flex items-center px-4 py-3"
                        onClick={closeModal}
                    >
                        <span>ホーム</span>
                    </Link>
                    <Link
                        to="/categories"
                        className="flex items-center px-4 py-3"
                        onClick={closeModal}
                    >
                        <span>カテゴリ一覧</span>
                    </Link>
                    <Link
                        to="/transactions"
                        className="flex items-center px-4 py-3"
                        onClick={closeModal}
                    >
                        <span>取引一覧</span>
                    </Link>
                </div>
            </DialogContent>
        </Dialog>
    );
}
