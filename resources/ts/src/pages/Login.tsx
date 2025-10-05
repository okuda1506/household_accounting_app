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
import { ChartNoAxesColumn } from "lucide-react";

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

            const accessToken = response.data.data.token;
            localStorage.setItem("access_token", accessToken);
            toast.success(response.data.message);
            navigate("/");
        } catch (error: any) {
            setErrors([error.response.data.messages[0]]);
            toast.error("ログインに失敗しました");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <Card className="relative bg-black border border-gray-800 w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-lg font-semibold">
                        サインイン
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
                                サインイン状態を保持
                            </label>
                        </div>

                        {/* Submit */}
                        <div className="space-y-4 pt-6">
                            <button
                                type="submit"
                                className="w-full rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                サインイン
                            </button>
                            <a
                                href="/forgot-password"
                                className="block text-sm text-gray-400 underline hover:text-gray-200"
                            >
                                パスワードをお忘れの場合
                            </a>
                            <Link
                                to="/register"
                                className="block text-sm text-gray-400 underline hover:text-gray-200"
                            >
                                サインアップはこちら
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
