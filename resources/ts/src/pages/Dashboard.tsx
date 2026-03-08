import { useEffect, useState } from "react";
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

import type {
    MonthlySummary,
    ExpenseTrend,
    RecentTransaction,
    DashboardResponse,
} from "../types/dashboard";
import { User } from "../types/user";
import { Category } from "../types/categories";
import { PaymentMethod } from "../types/paymentMethod";
import { AiAdviceResult } from "../types/aiAdviceResult";
import { toast } from "react-toastify";

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
            setIsAiAnalyzing(true);
            // const response = await api.post("/ai/advice");
            // 仮実装
            await new Promise((resolve) => setTimeout(resolve, 5000));
            setAiAdvice({
                risk_level: "danger",
                analysis_reason:
                    "現在の支出ペースでは予算を超過する見込みです。特に食費の使い方を見直す必要があります。",
                micro_action:
                    "今日の食費を1,500円以内に抑え、コンビニではなくスーパーを利用しましょう。",
                motivation:
                    "今日の上限を守ることが、月末の余裕につながります。",
            });
            setIsAiAdviceVisible(true);
        } catch (error) {
            console.error("AI analysis failed:", error);
            toast.error("AI分析に失敗しました");
        } finally {
            setIsAiAnalyzing(false);
        }
    };

    const aiButtonContent = isAiAnalyzing ? (
        <>
            <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
            <span className="text-sm font-medium">分析中...</span>
        </>
    ) : (
        <>
            <BotMessageSquare className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-medium">AIに分析させる</span>
        </>
    );

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // 予算管理プログレスバーのアニメーション効果
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
                                                            {Math.round(
                                                                budgetUsagePercentage,
                                                            )}
                                                            %
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
                                    {/* AI分析 */}
                                    {user?.ai_advice_mode && (
                                        <div className="mt-6 space-y-4">
                                            <button
                                                onClick={handleAiAdvice}
                                                disabled={isAiAnalyzing}
                                                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {aiButtonContent}
                                            </button>

                                            {aiAdvice && isAiAdviceVisible && (
                                                <div className="rounded-lg border border-gray-800 bg-gray-950 p-4 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-sm font-semibold text-white">
                                                            AIアドバイス
                                                        </h3>
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                                aiAdvice.risk_level ===
                                                                "danger"
                                                                    ? "bg-red-900/40 text-red-300"
                                                                    : aiAdvice.risk_level ===
                                                                        "warning"
                                                                      ? "bg-yellow-900/40 text-yellow-300"
                                                                      : "bg-blue-900/40 text-blue-300"
                                                            }`}
                                                        >
                                                            {
                                                                aiAdvice.risk_level
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <p className="text-xs text-gray-400">
                                                            分析
                                                        </p>
                                                        <p className="text-sm text-gray-200 leading-relaxed">
                                                            {
                                                                aiAdvice.analysis_reason
                                                            }
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2 rounded-md border border-indigo-900/50 bg-indigo-950/30 p-3">
                                                        <p className="text-xs text-indigo-300 font-medium">
                                                            今日のアクション
                                                        </p>
                                                        <p className="text-sm text-white leading-relaxed">
                                                            {
                                                                aiAdvice.micro_action
                                                            }
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <p className="text-xs text-gray-400">
                                                            メッセージ
                                                        </p>
                                                        <p className="text-sm text-gray-200 leading-relaxed">
                                                            {
                                                                aiAdvice.motivation
                                                            }
                                                        </p>
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
