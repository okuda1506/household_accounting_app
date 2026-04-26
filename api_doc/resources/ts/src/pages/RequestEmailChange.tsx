import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Loader2, Mail } from "lucide-react";
import { toast } from "react-toastify";

import api from "../../lib/axios";
import { extractFieldErrors, type FieldErrors } from "../../lib/error-response";
import {
    SettingsPageShell,
    settingsInfoCardClassName,
    settingsInputClassName,
} from "../components/settings/SettingsPageShell";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const RequestEmailChange = () => {
    const navigate = useNavigate();
    const [currentEmail, setCurrentEmail] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState<FieldErrors>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await api.get("/user");
                setCurrentEmail(response.data.email);
            } catch (error) {
                toast.error("ユーザー情報の取得に失敗しました。");
                navigate("/settings");
            }
        };

        fetchCurrentUser();
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            await api.post("/user/email/request", { email });
            toast.success("認証コードを送信しました");
            navigate("/settings/email/verify", { state: { email } });
        } catch (error: any) {
            setErrors(
                extractFieldErrors(error, "認証コードの送信に失敗しました。")
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <SettingsPageShell
            icon={Mail}
            title="メールアドレス変更"
            description="新しいメールアドレス宛に認証コードを送信します。"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                    <div className="rounded-2xl border border-red-200/80 bg-red-50/90 p-4 text-sm text-red-700 shadow-sm dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                            <div className="space-y-1">
                                {errors.general.map((error, index) => (
                                    <p key={index}>{error}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {currentEmail && (
                    <div className={settingsInfoCardClassName}>
                        <p className="text-sm font-medium text-muted-foreground">
                            現在のメールアドレス
                        </p>
                        <p className="mt-2 text-sm text-foreground">
                            {currentEmail}
                        </p>
                    </div>
                )}

                <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                        <Label htmlFor="email">新しいメールアドレス</Label>
                        {errors.email?.[0] && (
                            <p className="text-right text-sm text-red-400">
                                {errors.email[0]}
                            </p>
                        )}
                    </div>
                    <div className="relative">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onClear={() => setEmail("")}
                            className={`${settingsInputClassName} ${
                                errors.email ? "border-red-500" : ""
                            }`}
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
                                送信中...
                            </>
                        ) : (
                            "認証コードを送信"
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="utility"
                        onClick={() => navigate("/settings")}
                        className="h-12 w-full rounded-xl text-sm font-semibold"
                    >
                        キャンセル
                    </Button>
                </div>
            </form>
        </SettingsPageShell>
    );
};

export default RequestEmailChange;
