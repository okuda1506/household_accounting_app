"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Bars3Icon as MenuIcon } from "@heroicons/react/24/outline";
import {
    ChevronRight,
    LayoutDashboard,
    ReceiptText,
    Settings2,
    Tags,
    type LucideIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

type NavigationItem = {
    to: string;
    label: string;
    description: string;
    icon: LucideIcon;
    isActive: (pathname: string) => boolean;
};

const navigationItems: NavigationItem[] = [
    {
        to: "/",
        label: "ダッシュボード",
        description: "収支概要と今月の流れを確認",
        icon: LayoutDashboard,
        isActive: (pathname) => pathname === "/",
    },
    {
        to: "/categories",
        label: "カテゴリ",
        description: "費目の追加と整理をまとめて管理",
        icon: Tags,
        isActive: (pathname) => pathname.startsWith("/categories"),
    },
    {
        to: "/transactions",
        label: "取引",
        description: "入出金の一覧と記録をすばやく操作",
        icon: ReceiptText,
        isActive: (pathname) => pathname.startsWith("/transactions"),
    },
    {
        to: "/settings",
        label: "設定",
        description: "アカウントとアプリの設定",
        icon: Settings2,
        isActive: (pathname) => pathname.startsWith("/settings"),
    },
];

export function NavigationModal() {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    const closeModal = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="utility"
                    className="h-10 w-10 rounded-full border-border/80 bg-background/70 px-0 shadow-none backdrop-blur-sm"
                >
                    <MenuIcon className="h-6 w-6" />
                </Button>
            </DialogTrigger>
            <DialogContent className="left-auto right-4 top-20 w-[calc(100%-2rem)] max-w-sm translate-x-0 translate-y-0 gap-0 overflow-hidden rounded-[28px] border-border/70 bg-background/95 p-0 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.55)] backdrop-blur-xl sm:right-6 sm:top-24">
                <DialogHeader className="border-b border-border/60 px-6 pb-4 pt-6 text-left">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                        MENU
                    </span>
                    <DialogTitle className="pr-10 text-[1.35rem] font-semibold tracking-tight">
                        すばやく移動
                    </DialogTitle>
                    <DialogDescription className="pr-10 text-sm leading-6">
                        主要な画面へショートカットできます。
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 p-3">
                    {navigationItems.map(
                        ({ to, label, description, icon: Icon, isActive }) => {
                            const active = isActive(location.pathname);

                            return (
                                <Link
                                    key={to}
                                    to={to}
                                    className={cn(
                                        "group flex items-center gap-4 rounded-[22px] border px-4 py-4 transition-all duration-200",
                                        active
                                            ? "border-border/80 bg-accent shadow-sm"
                                            : "border-transparent hover:border-border/70 hover:bg-accent/70"
                                    )}
                                    onClick={closeModal}
                                >
                                    <div
                                        className={cn(
                                            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors",
                                            active
                                                ? "bg-primary/12 text-primary"
                                                : "bg-foreground/[0.05] text-muted-foreground group-hover:bg-foreground/[0.08] group-hover:text-foreground dark:bg-background/80"
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0 flex-1 text-left">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-foreground">
                                                {label}
                                            </span>
                                            {active && (
                                                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                                                    現在地
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                            {description}
                                        </p>
                                    </div>
                                    <ChevronRight
                                        className={cn(
                                            "h-4 w-4 shrink-0 transition-all duration-200",
                                            active
                                                ? "text-primary"
                                                : "text-muted-foreground group-hover:translate-x-0.5 group-hover:text-foreground"
                                        )}
                                    />
                                </Link>
                            );
                        }
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
