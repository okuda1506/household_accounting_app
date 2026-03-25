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
import { Bars3Icon as MenuIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export function NavigationModal() {
    const [open, setOpen] = useState(false);

    const closeModal = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="utility" className="h-10 w-10 px-0">
                    <MenuIcon className="h-6 w-6" />
                </Button>
            </DialogTrigger>
            <DialogContent className="rounded-lg">
                <DialogHeader>
                    <DialogTitle>メニュー</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Link
                        to="/"
                        className="flex items-center justify-center rounded-md px-4 py-3 transition-colors hover:bg-accent"
                        onClick={closeModal}
                    >
                        <span>ダッシュボード</span>
                    </Link>
                    <Link
                        to="/categories"
                        className="flex items-center justify-center rounded-md px-4 py-3 transition-colors hover:bg-accent"
                        onClick={closeModal}
                    >
                        <span>カテゴリ</span>
                    </Link>
                    <Link
                        to="/transactions"
                        className="flex items-center justify-center rounded-md px-4 py-3 transition-colors hover:bg-accent"
                        onClick={closeModal}
                    >
                        <span>取引</span>
                    </Link>
                    <Link
                        to="/settings"
                        className="flex items-center justify-center rounded-md px-4 py-3 transition-colors hover:bg-accent"
                        onClick={closeModal}
                    >
                        <span>設定</span>
                    </Link>
                </div>
            </DialogContent>
        </Dialog>
    );
}
