import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, Loader2, Mail } from "lucide-react";
import { toast } from "react-toastify";

import api from "../../lib/axios";
import { AuthShell } from "../components/auth/AuthShell";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const inputClassName =
    "h-12 rounded-xl border-border/70 bg-background/80 pl-11 shadow-sm transition focus-visible:border-primary/40 focus-visible:ring-[3px] focus-visible:ring-primary/20 focus-visible:ring-offset-0 dark:bg-background/60";

const linkClassName =
    "inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setIsSubmitting(true);

        try {
            await api.post("/forgot-password", { email });
            toast.success("案内メールを送信しました。");
        } catch (error: any) {
            setErrors(error.response.data.messages);
            toast.error("送信に失敗しました。");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthShell variant="simple">
            <div className="mx-auto w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Mail className="h-5 w-5" />
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                            パスワードリセット
                        </h1>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                        <span className="block">
                            ご登録のメールアドレスを入力してください。
                        </span>
                        <span className="block">
                            パスワードリセット、またはアカウント再開用のリンクをメールでお送りします。
                        </span>
                    </p>
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

                    <div className="space-y-4 pt-2">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-12 w-full rounded-xl text-sm font-semibold shadow-lg shadow-primary/25"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    送信中...
                                </>
                            ) : (
                                "送信"
                            )}
                        </Button>

                        <Link to="/login" className={linkClassName}>
                            ログイン画面に戻る
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </form>
            </div>
        </AuthShell>
    );
};

export default ForgotPassword;
