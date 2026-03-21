import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { TypeAnimation } from "react-type-animation";
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
            danger: "border-red-500/30 bg-red-500/10 text-red-300",
            warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
            safe: "border-blue-500/30 bg-blue-500/10 text-blue-300",
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
        <div className="min-h-screen bg-black text-white">
            <nav className="border-b border-gray-800">
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
                    <Card className="bg-black border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">
                                今月のサマリ
                            </CardTitle>
                            <p className="text-gray-400">
                                {year}年 {month}月
                            </p>
                        </CardHeader>
                        <CardContent>
                            {summary && (
                                <>
                                    <div className="flex justify-between items-center text-sm">
                                        <div>
                                            <p className="text-gray-400">
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
                                            <p className="text-gray-400">
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
                                            <p className="text-gray-400">
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
                                                        <span className="text-gray-400">
                                                            予算消化率（限度額:
                                                            ¥
                                                            {user.budget.toLocaleString()}
                                                            ）
                                                        </span>
                                                        <span className="text-white font-medium">
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
                                                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
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
                                            <button
                                                onClick={handleAiAdvice}
                                                disabled={isAiAnalyzing}
                                                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {aiButtonContent}
                                            </button>

                                            {aiAdvice && isAiAdviceVisible && (
                                                <div
                                                    ref={aiAdviceRef}
                                                    className="animate-in fade-in slide-in-from-top-6 duration-1000 ease-out relative overflow-hidden rounded-2xl border border-indigo-900/30 bg-gradient-to-br from-black via-gray-950 to-indigo-950/20 p-5 shadow-[0_0_0_1px_rgba(79,70,229,0.06),0_0_24px_rgba(99,102,241,0.12)]"
                                                >
                                                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.10),transparent_40%)]" />

                                                    <div className="relative space-y-5">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="space-y-1">
                                                                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-indigo-300/80">
                                                                    AI Coaching
                                                                </p>
                                                                <h3 className="text-base font-semibold text-white">
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
                                                            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                                                                <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gray-400">
                                                                    Analysis
                                                                </p>
                                                                <p className="text-sm leading-7 text-gray-100">
                                                                    {
                                                                        aiAdvice
                                                                            .analysis
                                                                            .analysis_reason
                                                                    }
                                                                </p>
                                                            </div>

                                                            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4 shadow-inner shadow-indigo-950/30">
                                                                <p className="mb-2 text-xs font-medium uppercase tracking-widest text-indigo-300">
                                                                    Action Today
                                                                </p>
                                                                <p className="text-sm font-medium leading-7 text-white">
                                                                    {
                                                                        aiAdvice
                                                                            .advice
                                                                            .micro_action
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-4 py-3">
                                                            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-emerald-300/90">
                                                                Message
                                                            </p>
                                                            <p className="text-sm leading-7 text-gray-100">
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

                    <Card className="bg-black border-gray-800">
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
                                                    <p className="text-gray-400">
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
                                <p className="text-gray-400 text-center py-4">
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
