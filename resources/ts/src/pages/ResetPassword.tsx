import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../lib/axios";
import { AlertTriangle } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";

const ResetPassword = () => {
    const { token } = useParams<{ token: string }>();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") || "";
    const [errors, setErrors] = useState<string[]>([]);
    const [status, setStatus] = useState<string | null>(null);
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [isInvalidLink, setIsInvalidLink] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token || !email) {
            setIsInvalidLink(true);
            toast.error(
                "無効なパスワードリセットリンクです。再度メールを送信してください。"
            );

            // 数秒後にリセットリクエスト画面へ戻す
            setTimeout(() => navigate("/forgot-password"), 10000);
        } else {
            setIsInvalidLink(false);
        }
    }, [token, email, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setStatus(null);
        try {
            const response = await api.post("/reset-password", {
                email,
                token,
                password,
                password_confirmation: passwordConfirmation,
            });
            setStatus(response.data.status);
            toast.success("パスワードを更新しました。");
            navigate("/login");
        } catch (error: any) {
            console.log(error);
            setErrors(error.response.data.messages);
            toast.error("パスワードの更新に失敗しました。");
        }
    };

    // 無効リンクの場合
    if (isInvalidLink) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
                <Card className="relative bg-black border border-gray-800 w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center text-lg font-semibold text-red-400">
                            無効なリンク
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-gray-400">
                        このパスワード再設定リンクは無効です。
                        <br />
                        10秒後にパスワード再発行画面へ移動します。
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <Card className="relative bg-black border border-gray-800 w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-lg font-semibold">
                        新しいパスワードを設定
                    </CardTitle>
                </CardHeader>
                <CardContent>
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
                        <div>
                            <label className="block text-sm text-white mb-1">
                                メールアドレス
                            </label>
                            <input
                                type="email"
                                value={email}
                                disabled
                                className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-white mb-1">
                                新しいパスワード
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-white mb-1">
                                パスワード確認
                            </label>
                            <input
                                type="password"
                                value={passwordConfirmation}
                                onChange={(e) =>
                                    setPasswordConfirmation(e.target.value)
                                }
                                className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                パスワードを変更
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResetPassword;
