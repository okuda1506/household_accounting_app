import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    AlertTriangle,
    ArrowRight,
    LockKeyhole,
    Mail,
    User,
    UserPlus,
} from "lucide-react";
import { toast } from "react-toastify";

import api from "../../lib/axios";
import { AuthShell } from "../components/auth/AuthShell";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { PasswordInput } from "../components/ui/password-input";

const inputClassName =
    "h-12 rounded-xl border-border/70 bg-background/80 pl-11 shadow-sm transition focus-visible:border-primary/40 focus-visible:ring-[3px] focus-visible:ring-primary/20 focus-visible:ring-offset-0 dark:bg-background/60";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
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
            const response = await api.post("/register", {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            const accessToken = response.data.token;
            localStorage.setItem("access_token", accessToken);
            toast.success(response.data.message || "ユーザー登録が完了しました。");
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
        <AuthShell
            brandName="Kakei Flow"
            title="サインアップ"
            panelTitle={
                <>
                    <span className="block">家計の流れを</span>
                    <span className="block">シンプルに整える</span>
                </>
            }
            panelDescription="記録とAIからのアドバイスで、日々の支出習慣を自然に見直せます。"
        >
            <div className="rounded-[28px] border border-border/70 bg-background/55 p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.45)] backdrop-blur-sm sm:p-7">
                <div className="mb-5 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <UserPlus className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                            KAKEI FLOW を始める
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {errors.length > 0 && (
                        <div className="rounded-2xl border border-red-200/80 bg-red-50/90 p-4 text-sm text-red-700 shadow-sm dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                                <div className="space-y-1">
                                    {errors.map((error, index) => (
                                        <p key={index}>{error}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {errors.some((error) =>
                        error.includes(
                            "このアカウントは既に退会済みです。ご利用の場合は再開手続きをしてください。"
                        )
                    ) && (
                        <Link
                            to="/forgot-password"
                            className="inline-flex items-center gap-2 text-sm font-medium text-red-600 transition hover:text-red-700 dark:text-red-300 dark:hover:text-red-200"
                        >
                            再開手続きはこちら
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    )}

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name">名前</Label>
                            <div className="relative">
                                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={inputClassName}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">メールアドレス</Label>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={inputClassName}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">パスワード</Label>
                            <div className="relative">
                                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <PasswordInput
                                    id="password"
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={inputClassName}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">
                                パスワード (確認用)
                            </Label>
                            <div className="relative">
                                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <PasswordInput
                                    id="password_confirmation"
                                    autoComplete="new-password"
                                    required
                                    value={passwordConfirmation}
                                    onChange={(e) =>
                                        setPasswordConfirmation(e.target.value)
                                    }
                                    className={inputClassName}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <Button
                            type="submit"
                            className="h-12 w-full rounded-xl text-sm font-semibold shadow-lg shadow-primary/25"
                        >
                            サインアップ
                        </Button>

                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                        >
                            アカウントをお持ちですか？
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </form>
            </div>
        </AuthShell>
    );
};

export default Register;
