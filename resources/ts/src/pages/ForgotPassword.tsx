import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../lib/axios";
import { Loader2, AlertTriangle } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [status, setStatus] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setStatus(null);
        setIsSubmitting(true);
        try {
            const response = await api.post("/forgot-password", { email });
            setStatus(response.data.status);
            toast.success("案内メールを送信しました。");
        } catch (error: any) {
            setErrors(error.response.data.messages);
            toast.error("送信に失敗しました。");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <Card className="relative bg-black border border-gray-800 w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-lg font-semibold">
                        パスワードリセット
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 text-sm text-gray-400">
                        ご登録のメールアドレスを入力してください。パスワードリセット、またはアカウント再開用のリンクをメールでお送りします。
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* エラーメッセージ */}
                        {errors.length > 0 && (
                            <div className="bg-red-900/30 border border-red-500/50 text-red-400 text-sm p-3 rounded-md flex items-center space-x-2">
                                <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
                                <div>
                                    {errors.map((error, index) => (
                                        <p key={index}>{error}</p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm text-white mb-1"
                            >
                                メールアドレス
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex items-center justify-center w-full rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                    isSubmitting
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-indigo-700"
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        送信中...
                                    </>
                                ) : (
                                    "送信"
                                )}
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPassword;
