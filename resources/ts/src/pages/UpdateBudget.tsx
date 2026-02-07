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

const UpdateBudget = () => {
    const navigate = useNavigate();
    const [currentBudget, setCurrentBudget] = useState("");
    const [budget, setBudget] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await api.get("/user");
                setCurrentBudget(response.data.budget);
                setCurrentBudget(response.data.budget);
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
            const response = await api.put("/user/budget", {
                budget,
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

                                {currentBudget && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-400">
                                            現在の予算
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            ¥ {Number(currentBudget).toLocaleString("ja-JP")}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label
                                        htmlFor="budget"
                                        className="block text-sm mb-1"
                                    >
                                        予算
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="budget"
                                            type="text"
                                            inputMode="numeric"
                                            required
                                            value={budget}
                                            onChange={(e) =>
                                                setBudget(e.target.value.replace(/[^0-9]/g, ""))
                                            }
                                            className="w-full rounded bg-gray-900 px-3 py-2 pr-10 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        {budget && (
                                            <button
                                                type="button"
                                                onClick={() => setBudget("")}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                                                aria-label="Clear input"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>

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
