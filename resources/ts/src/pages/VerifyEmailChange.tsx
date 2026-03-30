import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    AlertTriangle,
    KeyRound,
    Loader2,
    Mail,
    ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";

import api from "../../lib/axios";
import {
    SettingsPageShell,
    settingsInfoCardClassName,
    settingsInputClassName,
} from "../components/settings/SettingsPageShell";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const VerifyEmailChange = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const email = state?.email;

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        if (!email) {
            toast.error(
                "認証コードの送信に失敗しました。最初からやり直してください。"
            );
            navigate("/settings/email/request", { replace: true });
        }
    }, [email, navigate]);

    if (!email) {
        return (
            <SettingsPageShell
                icon={AlertTriangle}
                title="認証コード入力"
                description="メールアドレス変更画面へ移動しています。"
            >
                <div className="text-sm text-muted-foreground">
                    画面を切り替えています。しばらくお待ちください。
                </div>
            </SettingsPageShell>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setLoading(true);

        try {
            await api.put("/user/email/update", { email, code });

            setTimeout(() => {
                toast.success("メールアドレスを変更しました");
                navigate("/settings");
            }, 2000);
        } catch (error: any) {
            const messages =
                error?.response?.data?.messages ??
                (error?.response?.data?.message
                    ? [error.response.data.message]
                    : ["認証コードの送信に失敗しました"]);
            setErrors(messages);
            setLoading(false);
        }
    };

    return (
        <SettingsPageShell
            icon={ShieldCheck}
            title="認証コード入力"
            description="新しいメールアドレス宛に届いた認証コードを入力してください。"
        >
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

                <div className={settingsInfoCardClassName}>
                    <p className="text-sm font-medium text-muted-foreground">
                        認証コード送信先
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-sm text-foreground">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{email}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="code">認証コード</Label>
                    <div className="relative">
                        <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="code"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className={settingsInputClassName}
                        />
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="h-12 w-full rounded-xl text-sm font-semibold shadow-lg shadow-primary/25"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                認証中...
                            </>
                        ) : (
                            "認証"
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="utility"
                        onClick={() => navigate("/settings/email/request")}
                        className="h-12 w-full rounded-xl text-sm font-semibold"
                    >
                        戻る
                    </Button>
                </div>
            </form>
        </SettingsPageShell>
    );
};

export default VerifyEmailChange;
