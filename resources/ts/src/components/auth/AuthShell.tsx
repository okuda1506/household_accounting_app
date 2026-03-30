import { ReactNode } from "react";
import {
    BarChart3,
    BotMessageSquare,
    ShieldCheck,
    Wallet,
    type LucideIcon,
} from "lucide-react";

import { cn } from "../../../lib/utils";
import { Card } from "../ui/card";

type Highlight = {
    description: string;
    icon: LucideIcon;
    title: string;
};

type AuthShellProps = {
    brandName?: string;
    children: ReactNode;
    className?: string;
    description?: string;
    eyebrow?: string;
    panelDescription?: string;
    panelTitle?: string;
    title?: string;
    variant?: "default" | "simple";
};

const highlights: Highlight[] = [
    {
        icon: Wallet,
        title: "毎月の支出をひと目で整理",
        description: "収入、支出、残額を落ち着いたUIでまとめて確認できます。",
    },
    {
        icon: BarChart3,
        title: "変化の兆しを早めに把握",
        description: "グラフと履歴を組み合わせて、お金の流れを見失いにくくします。",
    },
    {
        icon: ShieldCheck,
        title: "日々の入力に集中できる",
        description:
            "余計なノイズを抑えた構成で、必要な操作だけを素早く進められます。",
    },
    {
        icon: BotMessageSquare,
        title: "AIのアドバイスで支出習慣が変わる",
        description:
            "AIからのアドバイスが、記録から支出習慣の変化につながります。",
    },
];

export const AuthShell = ({
    brandName = "Kakei Flow",
    children,
    className,
    description,
    eyebrow,
    panelDescription,
    panelTitle,
    title,
    variant = "default",
}: AuthShellProps) => {
    const isSimple = variant === "simple";

    return (
        <div className="relative isolate min-h-screen overflow-hidden bg-[linear-gradient(160deg,hsl(var(--background))_0%,rgba(226,232,240,0.85)_48%,rgba(199,210,254,0.5)_100%)] text-foreground dark:bg-[linear-gradient(160deg,#020617_0%,#0f172a_42%,#111827_100%)]">
            <div className="absolute inset-x-0 top-[-12rem] h-[26rem] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.22),transparent_60%)] dark:bg-[radial-gradient(circle_at_top,rgba(129,140,248,0.32),transparent_60%)]" />
            <div className="absolute left-[-5rem] top-28 h-48 w-48 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-500/20" />
            <div className="absolute bottom-0 right-[-3rem] h-56 w-56 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-500/20" />

            <div
                className={cn(
                    "relative mx-auto flex min-h-screen w-full items-center px-4 py-10 sm:px-6 lg:px-8",
                    isSimple ? "max-w-xl justify-center" : "max-w-6xl"
                )}
            >
                <Card
                    className={cn(
                        isSimple
                            ? "w-full max-w-md rounded-[32px] border-border/70 bg-white/80 shadow-[0_32px_80px_-36px_rgba(15,23,42,0.5)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75"
                            : "w-full overflow-hidden rounded-[32px] border-white/60 bg-white/75 shadow-[0_32px_80px_-36px_rgba(15,23,42,0.55)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70",
                        className
                    )}
                >
                    {isSimple ? (
                        <div className="px-6 py-8 sm:px-8 sm:py-10">
                            {(eyebrow || title || description) && (
                                <div className="mx-auto mb-8 w-full max-w-md">
                                    {eyebrow && (
                                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">
                                            {eyebrow}
                                        </p>
                                    )}
                                    {title && (
                                        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                                            {title}
                                        </h1>
                                    )}
                                    {description && (
                                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                                            {description}
                                        </p>
                                    )}
                                </div>
                            )}

                            {children}
                        </div>
                    ) : (
                    <div className="grid lg:min-h-[720px] lg:grid-cols-[1.05fr_0.95fr]">
                        <div className="relative hidden overflow-hidden bg-slate-950 px-10 py-12 text-white lg:flex">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(129,140,248,0.38),transparent_35%),linear-gradient(160deg,rgba(15,23,42,0.98),rgba(30,41,59,0.96))]" />

                            <div className="relative space-y-10">
                                <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-slate-200">
                                    {brandName}
                                </div>

                                <div className="space-y-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-200/80">
                                        {eyebrow}
                                    </p>
                                    <h2 className="max-w-sm text-4xl font-semibold leading-tight">
                                        {panelTitle}
                                    </h2>
                                    <p className="max-w-md text-sm leading-7 text-slate-300">
                                        {panelDescription}
                                    </p>
                                </div>

                                <div className="grid gap-4">
                                    {highlights.map((highlight) => {
                                        const Icon = highlight.icon;

                                        return (
                                            <div
                                                key={highlight.title}
                                                className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-indigo-100">
                                                        <Icon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-white">
                                                            {highlight.title}
                                                        </p>
                                                        <p className="mt-2 text-sm leading-6 text-slate-300">
                                                            {
                                                                highlight.description
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-10">
                            <div className="mb-8 lg:hidden">
                                <div className="inline-flex items-center rounded-full border border-border/70 bg-background/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-foreground/80 shadow-sm backdrop-blur">
                                    {brandName}
                                </div>
                                <div className="mt-6 rounded-[28px] border border-border/70 bg-background/70 p-5 shadow-[0_20px_50px_-28px_rgba(15,23,42,0.35)] backdrop-blur">
                                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary/80">
                                        {eyebrow}
                                    </p>
                                    <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                                        {panelTitle}
                                    </h2>
                                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                        {panelDescription}
                                    </p>
                                </div>
                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    {highlights.map((highlight) => {
                                        const Icon = highlight.icon;

                                        return (
                                            <div
                                                key={highlight.title}
                                                className="rounded-2xl border border-border/70 bg-background/75 p-4 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] backdrop-blur"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                                        <Icon className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-foreground">
                                                            {highlight.title}
                                                        </p>
                                                        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                                                            {
                                                                highlight.description
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mx-auto w-full max-w-md">
                                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">
                                    {eyebrow}
                                </p>
                                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                                    {title}
                                </h1>
                                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                                    {description}
                                </p>

                                <div className="mt-8">{children}</div>
                            </div>
                        </div>
                    </div>
                    )}
                </Card>
            </div>
        </div>
    );
};
