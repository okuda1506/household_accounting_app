import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../lib/axios";
import { Card, CardContent } from "../components/ui/card";
import { NavigationModal } from "../components/NavigationModal";

const RequestEmailChange = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setLoading(true);

        try {
            await api.post("/user/email/request", { email });
            toast.success("認証コードを送信しました");
            navigate("/settings/email/verify", { state: { email } });
        } catch (error: any) {
            const messages = error?.response?.data?.messages ?? [
                "認証コードの送信に失敗しました",
            ];
            setErrors(messages);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <nav className="border-b border-gray-800">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="relative h-16 flex items-center">
                        <span className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold">
                            メールアドレス変更
                        </span>
                        <div className="absolute right-0">
                            <NavigationModal />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto py-6">
                <Card className="bg-black border border-gray-800 max-w-md mx-auto">
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
                                    新しいメールアドレス
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded bg-gray-900 px-3 py-2 border border-gray-700"
                                />
                            </div>

                            <div className="pt-6 space-y-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {loading ? "送信中..." : "認証コードを送信"}
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
            </main>
        </div>
    );
};

export default RequestEmailChange;
