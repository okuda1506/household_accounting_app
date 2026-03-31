import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { TypeAnimation } from "react-type-animation";
import {
    Button,
} from "../components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { ExpenseChart } from "../components/ExpenseChart";
import { NewTransactionModal } from "../components/transaction/NewTransactionModal";
import { NavigationMenuAnchor } from "../components/NavigationModal";
import { BotMessageSquare, Loader2 } from "lucide-react";
import api from "../../lib/axios";
import { toast } from "react-toastify";

import type {
    MonthlySummary,
    ExpenseTrend,
    RecentTransaction,
    DashboardResponse,
} from "../types/dashboard";
import type { User } from "../types/user";
import type { Category } from "../types/categories";
import type { PaymentMethod } from "../types/paymentMethod";
import type {
    AiAdviceApiResponse,
    AiAdviceResult,
} from "../types/aiAdviceResult";

const dashboardCardClassName =
    "relative overflow-hidden rounded-[32px] border-border/70 bg-background/55 shadow-[0_32px_80px_-36px_rgba(15,23,42,0.45)] backdrop-blur-sm";

const dashboardPanelClassName =
    "rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm backdrop-blur-sm";

const dashboardSummaryCardClassName =
    "rounded-3xl border p-4 shadow-sm backdrop-blur-sm";

const dashboardListShellClassName =
    "overflow-hidden rounded-3xl border border-border/60 bg-background/45 shadow-sm backdrop-blur-sm";

export default function Dashboard() {
    const [summary, setSummary] = useState<MonthlySummary | null>(null);
    const [trend, setTrend] = useState<ExpenseTrend[]>([]);
    const [transactions, setTransactions] = useState<RecentTransaction[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [allPaymentMethods, setAllPaymentMethods] = useState<PaymentMethod[]>(
        [],
    );
    const [progress, setProgress] = useState(0);
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);
    const [aiAdvice, setAiAdvice] = useState<AiAdviceResult | null>(null);
    const [isAiAdviceVisible, setIsAiAdviceVisible] = useState<boolean>(false);

    const aiAdviceRef = useRef<HTMLDivElement | null>(null);

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "M月d日");
    };

    const fetchDashboardData = () => {
        Promise.all([
            api.get<DashboardResponse>("/dashboard"),
            api.get("/categories"),
            api.get("/payment-methods"),
        ])
            .then(([dashboardRes, categoriesRes, paymentMethodsRes]) => {
                setSummary(dashboardRes.data.monthly_summary);
                setTrend(dashboardRes.data.expense_trend);
                setTransactions(dashboardRes.data.recent_transactions);
                setUser(dashboardRes.data.user);
                setAllCategories(categoriesRes.data.data);
                setAllPaymentMethods(paymentMethodsRes.data.data);
            })
            .catch((err) => {
                console.error("初期データの取得に失敗", err);
                toast.error("初期データの取得に失敗しました。");
            });
    };

    const handleAiAdvice = async () => {
        try {
            if (isAiAnalyzing) return; // 連打(AI APIコスト増加)防止

            setAiAdvice(null);
            setIsAiAdviceVisible(false);

            setIsAiAnalyzing(true);
            const response = await api.get<AiAdviceApiResponse>("/ai-advice");
            const adviceData = response.data.data;

            setAiAdvice(adviceData);
            setIsAiAdviceVisible(true);
        } catch (error) {
            console.error("AI advice failed:", error);
            toast.error("AIアドバイス取得に失敗しました");
        } finally {
            setIsAiAnalyzing(false);
        }
    };

    const aiButtonContent = isAiAnalyzing ? (
        <>
            <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
            <span className="text-sm font-medium">取得中...</span>
        </>
    ) : (
        <>
            <BotMessageSquare className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-medium">AIアドバイスを受ける</span>
        </>
    );

    const getRiskLevelClasses = (riskLevel: AiAdviceResult["risk_level"]) => {
        const classMap = {
            danger: "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300",
            warning: "border-amber-200 bg-amber-50 text-amber-700 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-300",
            safe: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300",
        };

        return classMap[riskLevel] ?? classMap.safe;
    };

    const getRiskLevelLabel = (riskLevel: AiAdviceResult["risk_level"]) => {
        const labelMap = {
            danger: "警告",
            warning: "要注意",
            safe: "安全",
        };

        return labelMap[riskLevel] ?? "安全";
    };

    const canUseAiAdvice = !!user && (user.budget ?? 0) > 0 && user.ai_advice_mode;

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // 予算管理プログレスバーのアニメーション
    useEffect(() => {
        if (summary && user && user.budget !== null && user.budget > 0) {
            const calculatedProgress = Math.min(
                (parseInt(summary.expense) / user.budget) * 100,
                100,
            );
            const timer = setTimeout(() => {
                setProgress(calculatedProgress);
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [summary, user]);

    // AIアドバイス結果表示のスクロールアニメーション
    useEffect(() => {
        if (isAiAdviceVisible && aiAdviceRef.current) {
            aiAdviceRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [isAiAdviceVisible]);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <nav className="border-b border-border">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative h-16 flex items-center">
                        <span className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold">
                            ダッシュボード
                        </span>
                        <NavigationMenuAnchor />
                    </div>
                </div>
            </nav>
            <main className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0 space-y-6">
                    <div className="fixed bottom-4 right-4 z-50">
                        <NewTransactionModal
                            onSuccess={fetchDashboardData}
                            allCategories={allCategories}
                            allPaymentMethods={allPaymentMethods}
                        />
                    </div>
                    <div>
                        {user ? (
                            <TypeAnimation
                                sequence={[`Hey, ${user.name} 🖐️`]}
                                wrapper="h1"
                                speed={50}
                                className="text-3xl font-semibold tracking-tight"
                                cursor={false}
                                repeat={0}
                            />
                        ) : (
                            <h1 className="h-10 text-3xl font-semibold tracking-tight">
                                {"\u00A0"}
                            </h1>
                        )}
                    </div>
                    <Card className={dashboardCardClassName}>
                        <CardHeader className="relative space-y-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                        Monthly Overview
                                    </p>
                                    <CardTitle className="text-lg font-medium">
                                        今月のサマリ
                                    </CardTitle>
                                </div>
                                <div className="inline-flex w-fit items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-sm text-muted-foreground shadow-sm">
                                    {year}年 {month}月
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="relative space-y-6">
                            {summary && (
                                <>
                                    <section className="space-y-3">
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                月間サマリ
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                今月の収支をまとめて確認できます。
                                            </p>
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-3">
                                            <div
                                                className={`${dashboardSummaryCardClassName} border-emerald-500/20 bg-emerald-500/[0.08]`}
                                            >
                                                <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-700/80 dark:text-emerald-200/80">
                                                    収入
                                                </p>
                                                <p className="mt-4 text-xl font-semibold text-emerald-600 dark:text-emerald-300 sm:text-2xl">
                                                    ¥
                                                    {parseInt(
                                                        summary.income,
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                            <div
                                                className={`${dashboardSummaryCardClassName} border-rose-500/20 bg-rose-500/[0.08]`}
                                            >
                                                <p className="text-xs font-medium uppercase tracking-[0.18em] text-rose-700/80 dark:text-rose-200/80">
                                                    支出
                                                </p>
                                                <p className="mt-4 text-xl font-semibold text-rose-600 dark:text-rose-300 sm:text-2xl">
                                                    ¥
                                                    {parseInt(
                                                        summary.expense,
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                            <div
                                                className={`${dashboardSummaryCardClassName} border-border/60 bg-background/70`}
                                            >
                                                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                                    収支
                                                </p>
                                                <p className="mt-4 text-xl font-semibold sm:text-2xl">
                                                    ¥
                                                    {summary.balance.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </section>
                                    {/* 予算消化率プログレスバー */}
                                    {user &&
                                        user.budget !== null &&
                                        user.budget > 0 &&
                                        (() => {
                                            const expense = parseInt(
                                                summary.expense,
                                            );
                                            const budgetUsagePercentage =
                                                (expense / user.budget) * 100;
                                            const isOver =
                                                budgetUsagePercentage > 100;

                                            return (
                                                <div
                                                    className={`${dashboardPanelClassName} space-y-3`}
                                                >
                                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                        <span className="text-muted-foreground">
                                                            予算消化率（限度額:
                                                            ¥
                                                            {user.budget.toLocaleString()}
                                                            ）
                                                        </span>
                                                        <span className="font-medium text-foreground">
                                                            {Math.min(
                                                                100,
                                                                Math.round(
                                                                    budgetUsagePercentage,
                                                                ),
                                                            )}
                                                            %
                                                            {isOver && (
                                                                <span className="text-red-400 ml-1">
                                                                    (超過)
                                                                </span>
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/80">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-500 ease-out ${
                                                                budgetUsagePercentage >=
                                                                100
                                                                    ? "bg-gradient-to-r from-red-500 to-red-700"
                                                                    : budgetUsagePercentage >
                                                                        70
                                                                      ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                                                                      : "bg-gradient-to-r from-blue-500 to-indigo-500"
                                                            }`}
                                                            style={{
                                                                width: `${progress}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    {expense > user.budget && (
                                                        <p className="text-xs font-medium text-red-500">
                                                            ⚠️
                                                            予算を超過しています
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    {/* AIアドバイス */}
                                    {canUseAiAdvice && (
                                        <div className="mt-6 space-y-4">
                                            <div className={dashboardPanelClassName}>
                                                <div className="space-y-4">
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                                            AI Advice
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            今月の支出状況をもとに、次の一手を提案します。
                                                        </p>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="utility"
                                                        onClick={handleAiAdvice}
                                                        disabled={isAiAnalyzing}
                                                        className="h-auto w-full justify-center rounded-xl border border-border/60 bg-background/85 px-4 py-3 shadow-sm hover:bg-background"
                                                    >
                                                        {aiButtonContent}
                                                    </Button>
                                                </div>
                                            </div>

                                            {aiAdvice && isAiAdviceVisible && (
                                                <div
                                                    ref={aiAdviceRef}
                                                    className="animate-in fade-in slide-in-from-top-6 relative overflow-hidden rounded-[28px] border border-border/70 bg-background/70 p-5 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.45)] backdrop-blur-sm duration-1000 ease-out"
                                                >
                                                    <div className="relative space-y-5">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="space-y-1">
                                                                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300/80">
                                                                    AI Coaching
                                                                </p>
                                                                <h3 className="text-base font-semibold text-foreground">
                                                                    今日のアドバイス
                                                                </h3>
                                                            </div>
                                                            <span
                                                                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${getRiskLevelClasses(aiAdvice.risk_level)}`}
                                                            >
                                                                {getRiskLevelLabel(
                                                                    aiAdvice.risk_level,
                                                                )}
                                                            </span>
                                                        </div>

                                                        <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                                                            <div className="rounded-2xl border border-border/60 bg-background/75 p-4 shadow-sm">
                                                                <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                                                                    Analysis
                                                                </p>
                                                                <p className="text-sm leading-7 text-foreground">
                                                                    {
                                                                        aiAdvice
                                                                            .analysis
                                                                            .analysis_reason
                                                                    }
                                                                </p>
                                                            </div>

                                                            <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/85 p-4 shadow-sm dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:shadow-inner dark:shadow-indigo-950/30">
                                                                <p className="mb-2 text-xs font-medium uppercase tracking-widest text-indigo-600 dark:text-indigo-300">
                                                                    Action Today
                                                                </p>
                                                                <p className="text-sm font-medium leading-7 text-foreground">
                                                                    {
                                                                        aiAdvice
                                                                            .advice
                                                                            .micro_action
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/85 px-4 py-3 shadow-sm dark:border-emerald-500/15 dark:bg-emerald-500/5">
                                                            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-emerald-700 dark:text-emerald-300/90">
                                                                Message
                                                            </p>
                                                            <p className="text-sm leading-7 text-foreground">
                                                                {
                                                                    aiAdvice.motivation
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {trend && <ExpenseChart trend={trend} />}

                    <Card className={dashboardCardClassName}>
                        <CardHeader className="relative space-y-4">
                            <div className="space-y-1">
                                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                    Recent Activity
                                </p>
                                <CardTitle className="text-lg font-medium">
                                    最近の取引
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="relative space-y-3">
                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    取引データ
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    直近の記録を一覧で確認できます。
                                </p>
                            </div>
                            {transactions.length > 0 ? (
                                <div className={dashboardListShellClassName}>
                                    <ul className="divide-y divide-border/50">
                                        {transactions.map((transaction) => {
                                            const amount = parseFloat(
                                                transaction.amount,
                                            );
                                            const isIncome =
                                                transaction.transaction_type_id ===
                                                1;
                                            const fallbackMemo = isIncome
                                                ? "収入の記録"
                                                : "支出の記録";

                                            return (
                                                <li key={transaction.id}>
                                                    <div className="flex items-start justify-between gap-4 px-4 py-4 sm:px-5">
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <span
                                                                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                                                        isIncome
                                                                            ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                                                                            : "bg-rose-500/10 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
                                                                    }`}
                                                                >
                                                                    {isIncome
                                                                        ? "収入"
                                                                        : "支出"}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {formatDate(
                                                                        transaction.transaction_date,
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <p className="mt-3 truncate text-sm font-medium text-foreground sm:text-[15px]">
                                                                {transaction.memo ||
                                                                    fallbackMemo}
                                                            </p>
                                                        </div>
                                                        <p
                                                            className={`shrink-0 text-right text-base font-semibold ${
                                                                isIncome
                                                                    ? "text-emerald-600 dark:text-emerald-300"
                                                                    : "text-rose-600 dark:text-rose-300"
                                                            }`}
                                                        >
                                                            {isIncome ? "+" : "-"}
                                                            ¥
                                                            {Math.abs(
                                                                amount,
                                                            ).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-border/70 bg-background/60 px-4 py-10 text-center text-muted-foreground">
                                    最近の取引はありません。
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
