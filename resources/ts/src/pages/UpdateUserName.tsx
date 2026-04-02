import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Loader2, User } from "lucide-react";
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

const UpdateUserName = () => {
    const navigate = useNavigate();
    const [currentName, setCurrentName] = useState("");
    const [name, setName] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await api.get("/user");
                setCurrentName(response.data.name);
                setName(response.data.name);
            } catch (error) {
                toast.error("ユーザー情報の取得に失敗しました。");
                navigate("/settings");
            }
        };

        fetchCurrentUser();
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setLoading(true);

        try {
            const response = await api.put("/user/name", { name });
            toast.success(response.data.message ?? "ユーザー名を変更しました");
            navigate("/settings");
        } catch (error: any) {
            const messages = error?.response?.data?.messages ?? [
                "ユーザー名の変更に失敗しました",
            ];
            setErrors(messages);
            toast.error("更新に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SettingsPageShell
            icon={User}
            title="ユーザー名変更"
            description="表示名を更新して、アカウント情報を整えます。"
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

                {currentName && (
                    <div className={settingsInfoCardClassName}>
                        <p className="text-sm font-medium text-muted-foreground">
                            現在のユーザー名
                        </p>
                        <p className="mt-2 text-sm text-foreground">
                            {currentName}
                        </p>
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="name">ユーザー名</Label>
                    <div className="relative">
                        <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onClear={() => setName("")}
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

export default UpdateUserName;
