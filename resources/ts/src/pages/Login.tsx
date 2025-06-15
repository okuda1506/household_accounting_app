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

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);

        try {
            const response = await api.post("/login", {
                email,
                password,
                remember, // todo: 多分ここ機能してない
            });

            const accessToken = response.data.token;
            localStorage.setItem("access_token", accessToken);
            toast.success("ログインしました");
            navigate("/");
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const allErrors = Object.values(
                    error.response.data.errors
                ).flat();
                setErrors(allErrors as string[]);
                console.log(errors);
            } else {
                const fallbackMessage = "ログインに失敗しました";
                setErrors([fallbackMessage]);
                toast.error(fallbackMessage);
            }
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <Card className="relative bg-black border border-gray-800 w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-lg font-semibold">
                        ログイン
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                autoComplete="username"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
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
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                id="remember_me"
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                            />
                            <label
                                htmlFor="remember_me"
                                className="ml-2 text-sm text-white"
                            >
                                ログイン状態を保持する
                            </label>
                        </div>

                        {/* Submit */}
                        <div className="flex items-center justify-between">
                            <a
                                href="/forgot-password"
                                className="text-sm text-gray-400 hover:text-gray-200 underline"
                            >
                                パスワードをお忘れの場合
                            </a>
                            <button
                                type="submit"
                                className="ml-3 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                ログイン
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
