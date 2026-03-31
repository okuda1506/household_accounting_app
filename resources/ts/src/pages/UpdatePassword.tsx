import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Loader2, LockKeyhole } from "lucide-react";
import { toast } from "react-toastify";

import api from "../../lib/axios";
import {
    SettingsPageShell,
    settingsInputClassName,
} from "../components/settings/SettingsPageShell";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { PasswordInput } from "../components/ui/password-input";

const UpdatePassword = () => {
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setLoading(true);

        try {
            await api.put("/user/password", {
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: newPasswordConfirmation,
            });
            toast.success("パスワードを変更しました");
            navigate("/settings");
        } catch (error: any) {
            const messages = error?.response?.data?.messages ?? [
                "パスワードの変更に失敗しました",
            ];
            setErrors(messages);
            toast.error("パスワードの変更に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SettingsPageShell
            icon={LockKeyhole}
            title="パスワード再設定"
            description="現在のパスワードを確認し、新しいパスワードへ更新します。"
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

                <div className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="current_password">現在のパスワード</Label>
                        <div className="relative">
                            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <PasswordInput
                                id="current_password"
                                autoComplete="current-password"
                                required
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                                className={settingsInputClassName}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="new_password">新しいパスワード</Label>
                        <div className="relative">
                            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <PasswordInput
                                id="new_password"
                                autoComplete="new-password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={settingsInputClassName}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="new_password_confirmation">
                            新しいパスワード（確認）
                        </Label>
                        <div className="relative">
                            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <PasswordInput
                                id="new_password_confirmation"
                                autoComplete="new-password"
                                required
                                value={newPasswordConfirmation}
                                onChange={(e) =>
                                    setNewPasswordConfirmation(e.target.value)
                                }
                                className={settingsInputClassName}
                            />
                        </div>
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
                                更新中...
                            </>
                        ) : (
                            "パスワードを変更"
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

export default UpdatePassword;
