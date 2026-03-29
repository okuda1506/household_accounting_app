import { useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../lib/axios";
import {
    Button,
} from "../components/ui/button";
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

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            navigate("/", { replace: true });
        }
    }, [navigate]);

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
            const fallbackMessage = "ログインに失敗しました。";
            setErrors([error.response.data.messages[0]]);
            toast.error(fallbackMessage);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
            <Card className="relative w-full max-w-md border-border shadow-sm">
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
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1 block text-sm text-foreground"
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
                                className="w-full rounded border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1 block text-sm text-foreground"
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
                                className="w-full rounded border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Remember Me 一旦不要とする */}
                        {/* <div className="flex items-center">
                            <input
                                id="remember_me"
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                            />
                            <label
                                htmlFor="remember_me"
                                className="ml-2 text-sm text-foreground"
                            >
                                サインイン状態を保持
                            </label>
                        </div> */}

                        {/* Submit */}
                        <div className="space-y-4 pt-6">
                            <Button type="submit" className="w-full">
                                サインイン
                            </Button>
                            <a
                                href="/forgot-password"
                                className="block text-sm text-muted-foreground underline hover:text-foreground"
                            >
                                パスワードをお忘れの場合
                            </a>
                            <Link
                                to="/register"
                                className="block text-sm text-muted-foreground underline hover:text-foreground"
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
