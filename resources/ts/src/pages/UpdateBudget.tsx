import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Loader2, Wallet } from "lucide-react";
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

const ToggleSwitch = ({
    checked,
    onChange,
    label,
}: {
    checked: boolean;
    label: string;
    onChange: (checked: boolean) => void;
}) => (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-muted/30 p-4">
        <div>
            <p className="text-sm font-medium text-foreground">{label}</p>
            <p className="mt-1 text-sm text-muted-foreground">
                毎月の予算を設定して、使いすぎを把握しやすくします。
            </p>
        </div>
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                checked ? "bg-primary" : "bg-muted"
            }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    checked ? "translate-x-6" : "translate-x-1"
                }`}
            />
        </button>
    </div>
);

const UpdateBudget = () => {
    const navigate = useNavigate();
    const [currentBudget, setCurrentBudget] = useState("");
    const [budget, setBudget] = useState("");
    const [isBudgetEnabled, setIsBudgetEnabled] = useState(true);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await api.get("/user");
                const userBudget = response.data.budget;
                setCurrentBudget(userBudget?.toString() ?? "");

                const enabled = Number(userBudget) > 0;
                setIsBudgetEnabled(enabled);
                if (enabled) {
                    setBudget(String(userBudget));
                }
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
            if (isBudgetEnabled && (budget === "" || Number(budget) <= 0)) {
                setErrors({ budget: ["1円以上の値を入力してください。"] });
                setLoading(false);
                return;
            }

            const submitValue = isBudgetEnabled ? budget : 0;
            const response = await api.put("/user/budget", {
                budget: submitValue,
            });

            toast.success(response.data.message ?? "予算を更新しました");
            navigate("/settings");
        } catch (error: any) {
            setErrors(extractFieldErrors(error, "予算の更新に失敗しました。"));
            toast.error("更新に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SettingsPageShell
            icon={Wallet}
            title="予算管理"
            description="毎月の予算を設定して、家計のコントロールを整えます。"
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

                <ToggleSwitch
                    label="予算コントロール"
                    checked={isBudgetEnabled}
                    onChange={setIsBudgetEnabled}
                />

                {isBudgetEnabled && currentBudget !== "" && (
                    <div className={settingsInfoCardClassName}>
                        <p className="text-sm font-medium text-muted-foreground">
                            現在の予算
                        </p>
                        <p className="mt-2 text-sm text-foreground">
                            ¥ {Number(currentBudget).toLocaleString("ja-JP")}
                        </p>
                    </div>
                )}

                {isBudgetEnabled && (
                    <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                            <Label htmlFor="budget">毎月の予算（円）</Label>
                            {errors.budget?.[0] && (
                                <p className="text-right text-sm text-red-400">
                                    {errors.budget[0]}
                                </p>
                            )}
                        </div>
                        <div className="relative">
                            <Wallet className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="budget"
                                type="text"
                                inputMode="numeric"
                                required={isBudgetEnabled}
                                value={budget}
                                onChange={(e) =>
                                    setBudget(
                                        e.target.value.replace(/[^0-9]/g, "")
                                    )
                                }
                                onClear={() => setBudget("")}
                                className={`${settingsInputClassName} ${
                                    errors.budget ? "border-red-500" : ""
                                }`}
                                placeholder="100000"
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-3 pt-2">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="h-12 w-full rounded-xl text-sm font-semibold shadow-lg shadow-primary/25"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                変更中...
                            </>
                        ) : (
                            "変更する"
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

export default UpdateBudget;
