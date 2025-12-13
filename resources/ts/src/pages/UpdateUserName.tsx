import { useState } from "react";
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

const UpdateUserName = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setLoading(true);

        try {
            const response = await api.put("/user/name", {
                name,
            });

            toast.success(response.data.message ?? "ユーザー名を変更しました");
            navigate("/settings");
        } catch (error: any) {
            const messages = error?.response?.data?.messages ?? [
                "ユーザー名の変更に失敗しました",
            ];
            setErrors(messages);
            toast.error("更新に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* ヘッダー */}
            <nav className="border-b border-gray-800">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative h-16 flex items-center">
                        <span className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold">
                            ユーザー名変更
                        </span>
                        <div className="absolute right-0">
                            <NavigationModal />
                        </div>
                    </div>
                </div>
            </nav>

            {/* メイン */}
            <main className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0">
                    <Card className="bg-black border border-gray-800 max-w-md mx-auto">
                        <CardHeader>
                            <CardTitle className="text-center text-lg font-medium">
                                新しいユーザー名
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* エラー表示 */}
                                {errors.length > 0 && (
                                    <div className="bg-red-900/30 border border-red-500/50 text-red-400 text-sm p-3 rounded-md">
                                        {errors.map((error, index) => (
                                            <p key={index}>{error}</p>
                                        ))}
                                    </div>
                                )}

                                {/* ユーザー名 */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm mb-1"
                                    >
                                        ユーザー名
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {/* ボタン */}
                                <div className="pt-6 space-y-3">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {loading ? "更新中..." : "変更する"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => navigate("/settings")}
                                        className="w-full text-sm text-gray-400 underline hover:text-gray-200"
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

export default UpdateUserName;
