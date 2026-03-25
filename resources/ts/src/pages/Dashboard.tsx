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
import { NavigationModal } from "../components/NavigationModal";
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
        return format(dateString, "M月d日");
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
                        <div className="absolute right-0">
                            <NavigationModal />
                        </div>
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
                                className="text-2xl"
                                cursor={false}
                                repeat={0}
                            />
                        ) : (
                            <h1 className="text-2xl h-8">{"\u00A0"}</h1>
                        )}
                    </div>
                    <Card className="border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">
                                今月のサマリ
                            </CardTitle>
                            <p className="text-muted-foreground">
                                {year}年 {month}月
                            </p>
                        </CardHeader>
                        <CardContent>
                            {summary && (
                                <>
                                    <div className="flex justify-between items-center text-sm">
                                        <div>
                                            <p className="text-muted-foreground">
                                                収入
                                            </p>
                                            <p className="text-xl font-semibold text-green-400">
                                                ¥
                                                {parseInt(
                                                    summary.income,
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">
                                                支出
                                            </p>
                                            <p className="text-xl font-semibold text-red-400">
                                                ¥
                                                {parseInt(
                                                    summary.expense,
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">
                                                収支
                                            </p>
                                            <p className="text-xl font-semibold">
                                                ¥
                                                {summary.balance.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
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
                                                <div className="space-y-2 mt-6">
                                                    <div className="flex justify-between text-sm">
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
                                                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
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
                                                        <p className="text-xs text-red-500 mt-1 font-medium">
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
                                            <Button
                                                type="button"
                                                variant="utility"
                                                onClick={handleAiAdvice}
                                                disabled={isAiAnalyzing}
                                                className="h-auto w-full justify-center bg-accent px-4 py-3 hover:bg-accent/80"
                                            >
                                                {aiButtonContent}
                                            </Button>

                                            {aiAdvice && isAiAdviceVisible && (
                                                <div
                                                    ref={aiAdviceRef}
                                                    className="animate-in fade-in slide-in-from-top-6 relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm duration-1000 ease-out"
                                                >
                                                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_40%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.10),transparent_40%)]" />

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
                                                            <div className="rounded-xl border border-border bg-muted/40 p-4">
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

                                                            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:shadow-inner dark:shadow-indigo-950/30">
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

                                                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-500/15 dark:bg-emerald-500/5">
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

                    <Card className="border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">
                                最近の取引
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {transactions.length > 0 ? (
                                <ul className="space-y-4">
                                    {transactions.map((transaction) => {
                                        const amount = parseFloat(
                                            transaction.amount,
                                        );
                                        const isIncome =
                                            transaction.transaction_type_id ===
                                            1;

                                        return (
                                            <li
                                                key={transaction.id}
                                                className="flex justify-between items-start text-sm"
                                            >
                                                <div className="min-w-0 flex-1 pr-4">
                                                    <p className="font-medium truncate">
                                                        {transaction.memo}
                                                    </p>
                                                    <p className="text-muted-foreground">
                                                        {formatDate(
                                                            transaction.transaction_date,
                                                        )}{" "}
                                                    </p>
                                                </div>
                                                <p
                                                    className={`font-medium shrink-0 text-right ${
                                                        isIncome
                                                            ? "text-green-400"
                                                            : "text-red-400"
                                                    }`}
                                                >
                                                    {isIncome ? "+" : "-"}¥
                                                    {Math.abs(
                                                        amount,
                                                    ).toLocaleString()}
                                                </p>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p className="text-center py-4 text-muted-foreground">
                                    最近の取引はありません。
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
