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

const UpdatePassword = () => {
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setLoading(true);

        try {
            await api.put("/user/password", {
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: newPasswordConfirmation,
            });
            toast.success("パスワードを変更しました");
            navigate("/settings");
        } catch (error: any) {
            const messages = error?.response?.data?.messages ?? [
                "パスワードの変更に失敗しました",
            ];
            setErrors(messages);
            toast.error("パスワードの変更に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
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

            {/* Main */}
            <main className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0">
                    <Card className="bg-black border border-gray-800 max-w-md mx-auto">
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">
                                パスワード再設定
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {errors.length > 0 && (
                                    <div className="bg-red-900/30 border border-red-500/50 text-red-400 text-sm p-3 rounded-md">
                                        {errors.map((e, i) => (
                                            <p key={i}>{e}</p>
                                        ))}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm mb-1">
                                        現在のパスワード
                                    </label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) =>
                                            setCurrentPassword(e.target.value)
                                        }
                                        className="w-full rounded bg-gray-900 px-3 py-2 border border-gray-700"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm mb-1">
                                        新しいパスワード
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(e.target.value)
                                        }
                                        className="w-full rounded bg-gray-900 px-3 py-2 border border-gray-700"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm mb-1">
                                        新しいパスワード（確認）
                                    </label>
                                    <input
                                        type="password"
                                        value={newPasswordConfirmation}
                                        onChange={(e) =>
                                            setNewPasswordConfirmation(
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded bg-gray-900 px-3 py-2 border border-gray-700"
                                    />
                                </div>

                                <div className="pt-6 space-y-3">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {loading
                                            ? "更新中..."
                                            : "パスワードを変更"}
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

export default UpdatePassword;
