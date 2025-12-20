import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../lib/axios";
import { Card, CardContent } from "../components/ui/card";
import { NavigationModal } from "../components/NavigationModal";

const VerifyEmailChange = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const email = state?.email;

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    if (!email) {
        navigate("/settings/email");
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setLoading(true);

        try {
            await api.post("/user/email/verify", { email, code });
            await api.put("/user/email/update", { email, code });

            setTimeout(() => {
                toast.success("メールアドレスを変更しました");
                navigate("/settings");
            }, 2000);
        } catch (error: any) {
            const messages = error?.response?.data?.messages ?? [
                "認証に失敗しました",
            ];
            setErrors(messages);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <nav className="border-b border-gray-800">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="relative h-16 flex items-center">
                        <span className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold">
                            認証コード入力
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

                            <p className="text-sm text-gray-400">
                                {email}{" "}
                                に送信された認証コードを入力してください。
                            </p>

                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full rounded bg-gray-900 px-3 py-2 border border-gray-700"
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded bg-indigo-600 px-4 py-2 text-sm font-medium"
                            >
                                {loading ? "認証中..." : "認証"}
                            </button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default VerifyEmailChange;
