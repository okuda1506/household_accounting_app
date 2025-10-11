import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../lib/axios";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);

        try {
            const response = await api.post("/register", {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            const accessToken = response.data.token;
            localStorage.setItem("access_token", accessToken);
            toast.success(
                response.data.message || "ユーザー登録が完了しました。"
            );
            navigate("/");
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.messages);
                toast.error("入力内容に誤りがあります。");
            } else {
                const fallbackMessage = "登録に失敗しました。";
                setErrors([error.response.data.messages[0]]);
                toast.error(fallbackMessage);
            }
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <Card className="relative bg-black border border-gray-800 w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-lg font-semibold">
                        新規登録
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
                        {errors.some((error) =>
                            error.includes(
                                "このアカウントは既に退会済みです。ご利用の場合は再開手続きをしてください。"
                            )
                        ) && (
                            <div>
                                <a
                                    href="/forgot-password"
                                    className="block text-sm text-red-400 underline"
                                >
                                    再開手続きはこちら
                                </a>
                            </div>
                        )}
                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm text-white mb-1"
                            >
                                名前
                            </label>
                            <input
                                id="name"
                                type="text"
                                autoComplete="name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

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
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email[0]}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm text-white mb-1"
                            >
                                パスワード
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password[0]}
                                </p>
                            )}
                        </div>

                        {/* Password Confirmation */}
                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="block text-sm text-white mb-1"
                            >
                                パスワード (確認用)
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={passwordConfirmation}
                                onChange={(e) =>
                                    setPasswordConfirmation(e.target.value)
                                }
                                className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Submit */}
                        <div className="space-y-4 pt-6">
                            <button
                                type="submit"
                                className="w-full rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                サインアップ
                            </button>
                            <Link
                                to="/login"
                                className="block text-sm text-gray-400 underline hover:text-gray-200"
                            >
                                アカウントをお持ちですか？
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Register;
