import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../lib/axios";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { NavigationModal } from "../components/NavigationModal";
import { X } from "lucide-react";

const ToggleSwitch = ({
    checked,
    onChange,
    label,
}: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
}) => (
    <div className="flex items-center justify-between py-2">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                checked ? "bg-blue-600" : "bg-gray-700"
            }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    checked ? "translate-x-6" : "translate-x-1"
                }`}
            />
        </button>
    </div>
);

const UpdateBudget = () => {
    const navigate = useNavigate();
    const [currentBudget, setCurrentBudget] = useState("");
    const [budget, setBudget] = useState("");
    const [isBudgetEnabled, setIsBudgetEnabled] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await api.get("/user");
                const userBudget = response.data.budget;
                setCurrentBudget(userBudget);

                // 予算が0より大きければ有効状態とする
                const enabled = Number(userBudget) > 0;
                setIsBudgetEnabled(enabled);
                if (enabled) {
                    setBudget(String(userBudget));
                }
            } catch (error) {
                toast.error("ユーザー情報の取得に失敗しました。");
                navigate("/settings");
            }
        };
        fetchCurrentUser();
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setLoading(true);

        try {
            // 予算有効時に0円以下または空の場合はエラーとする
            if (isBudgetEnabled && (budget === "" || Number(budget) <= 0)) {
                setErrors(["予算を設定する場合は、1円以上の値を入力してください。"]);
                setLoading(false);
                return;
            }

            // 無効の場合は0を送信する
            const submitValue = isBudgetEnabled ? budget : 0;

            const response = await api.put("/user/budget", {
                budget: submitValue,
            });

            toast.success(response.data.message ?? "予算を更新しました");
            navigate("/settings");
        } catch (error: any) {
            const messages = error?.response?.data?.messages ?? [
                "予算の更新に失敗しました",
            ];
            setErrors(messages);
            toast.error("更新に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <nav className="border-b border-gray-800">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative h-16 flex items-center">
                        <span className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold">
                            設定
                        </span>
                        <div className="absolute right-0">
                            <NavigationModal />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0">
                    <Card className="bg-black border border-gray-800 max-w-md mx-auto">
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">
                                予算管理
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {errors.length > 0 && (
                                    <div className="bg-red-900/30 border border-red-500/50 text-red-400 text-sm p-3 rounded-md">
                                        {errors.map((error, index) => (
                                            <p key={index}>{error}</p>
                                        ))}
                                    </div>
                                )}

                                <ToggleSwitch
                                    label="予算コントロール"
                                    checked={isBudgetEnabled}
                                    onChange={setIsBudgetEnabled}
                                />

                                {isBudgetEnabled && currentBudget !== "" && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-400">
                                            現在の予算
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            ¥{" "}
                                            {Number(
                                                currentBudget
                                            ).toLocaleString("ja-JP")}
                                        </p>
                                    </div>
                                )}

                                {isBudgetEnabled && (
                                    <div>
                                        <label
                                            htmlFor="budget"
                                            className="block text-sm mb-1"
                                        >
                                            毎月の予算（円）
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="budget"
                                                type="text"
                                                inputMode="numeric"
                                                required={isBudgetEnabled}
                                                value={budget}
                                                onChange={(e) =>
                                                    setBudget(
                                                        e.target.value.replace(
                                                            /[^0-9]/g,
                                                            ""
                                                        )
                                                    )
                                                }
                                                className="w-full rounded bg-gray-900 px-3 py-2 pr-10 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                placeholder="100000"
                                            />
                                            {budget && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setBudget("")
                                                    }
                                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                                                    aria-label="Clear input"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-6 space-y-3">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {loading ? "変更中..." : "変更する"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => navigate("/settings")}
                                        className="w-full rounded bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                                    >
                                        キャンセル
                                    </button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default UpdateBudget;
