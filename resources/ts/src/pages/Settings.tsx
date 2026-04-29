import { useState, useEffect } from "react";
import {
    User,
    Mail,
    Lock,
    LogOut,
    Trash2,
    Globe,
    Moon,
    Sun,
    ChevronRight,
    Wallet,
    BotMessageSquare,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { AppHeader } from "../components/AppHeader";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../lib/axios";
import DeleteAccountDialog from "../components/DeleteAccountDialog";
import SignOutDialog from "../components/SignOutDialog";
import { useTheme } from "../contexts/ThemeContext";

type SettingsTab = "account" | "app";

const SettingsTabs = ({
    activeTab,
    onChange,
}: {
    activeTab: SettingsTab;
    onChange: (tab: SettingsTab) => void;
}) => {
    return (
        <div className="relative w-full max-w-md mx-auto mb-6 rounded-full bg-foreground/[0.08] p-1 dark:bg-muted">
            {/* スライド時のbg */}
            <div
                className={`absolute top-1 left-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full border border-border bg-background shadow-sm transition-transform duration-300 ease-out ${
                    activeTab === "app"
                        ? "translate-x-[calc(100%)]"
                        : "translate-x-0"
                }`}
            />

            {/* button */}
            <div className="relative grid grid-cols-2">
                <button
                    onClick={() => onChange("account")}
                    className={`px-6 py-2 text-sm font-medium rounded-full transition-colors ${
                        activeTab === "account"
                            ? "text-foreground"
                            : "text-muted-foreground"
                    }`}
                >
                    アカウント設定
                </button>
                <button
                    onClick={() => onChange("app")}
                    className={`px-6 py-2 text-sm font-medium rounded-full transition-colors ${
                        activeTab === "app"
                            ? "text-foreground"
                            : "text-muted-foreground"
                    }`}
                >
                    アプリ設定
                </button>
            </div>
        </div>
    );
};

const SettingItem = ({
    icon: Icon,
    label,
    onClick,
    variant = "default",
    disabled = false,
    visuallyDisabled = false,
}) => {
    const textColor =
        variant === "danger"
            ? "text-red-500"
            : visuallyDisabled
            ? "text-muted-foreground"
            : "text-foreground";
    const iconColor =
        variant === "danger"
            ? "text-red-500"
            : "text-muted-foreground";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full flex items-center justify-between px-4 py-3 transition-colors rounded-lg group ${
                visuallyDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-accent"
            }`}
        >
            <div className="flex items-center gap-3">
                <Icon size={20} className={iconColor} />
                <span className={`${textColor} text-sm font-medium`}>
                    {label}
                </span>
            </div>
            <ChevronRight
                size={20}
                className={`transition-colors ${
                    visuallyDisabled
                        ? "text-muted-foreground opacity-70"
                        : "text-muted-foreground group-hover:text-foreground"
                }`}
            />
        </button>
    );
};

const ToggleItem = ({
    icon: Icon,
    label,
    checked,
    onChange,
    disabled,
    visuallyDisabled = false,
}) => {
    return (
        <div
            className={`flex items-center justify-between px-4 py-3 transition-opacity ${
                visuallyDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
            <div className="flex items-center gap-3">
                <Icon
                    size={20}
                    className="text-muted-foreground"
                />
                <span
                    className={`text-sm font-medium ${
                        visuallyDisabled
                            ? "text-muted-foreground"
                            : "text-foreground"
                    }`}
                >
                    {label}
                </span>
            </div>
            <button
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    checked ? "bg-blue-600" : "bg-muted"
                } ${disabled ? "cursor-not-allowed" : ""}`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        checked ? "translate-x-6" : "translate-x-1"
                    }`}
                />
            </button>
        </div>
    );
};

export default function Settings() {
    const { isDarkMode, setIsDarkMode } = useTheme();
    const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<SettingsTab>("account");
    const [isAiAdviceModeEnabled, setIsAiAdviceModeEnabled] = useState(false);
    const [isAiUpdating, setIsAiUpdating] = useState(false);
    const [isBudgetEnabled, setIsBudgetEnabled] = useState(false);
    // NOTE:
    // 操作制御（disabled）と視覚的な無効状態（visuallyDisabled）を分離
    // 通信中は操作のみ無効化し、予算未設定時のみグレーアウトする
    const isAiAdviceDisabled = isAiUpdating || !isBudgetEnabled;
    const isAiAdviceVisuallyDisabled = !isBudgetEnabled;
    const navigate = useNavigate();

    // todo: 言語切り替えの処理を追加
    // const handleClick = (item) => {
    //     console.log(`${item} clicked`);
    //     // ここで後からモーダルを開く処理を追加
    // };

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await api.get("/user");
                const userBudget = response.data.budget;
                const userAiAdviceMode = response.data.ai_advice_mode;

                // 予算管理設定が有効かどうかを判定
                setIsBudgetEnabled((userBudget ?? 0) > 0);
                // AIアドバイスモードが有効かどうかを判定
                setIsAiAdviceModeEnabled(userAiAdviceMode);
            } catch (_error) {
                toast.error("ユーザー情報の取得に失敗しました。");
                navigate("/settings");
            }
        };
        fetchCurrentUser();
    }, [navigate]);

    const handleAiAdviceModeChange = async (value: boolean) => {
        try {
            setIsAiUpdating(true);
            await api.put("/user/ai-advice-mode", {
                ai_advice_mode: value,
            });
            setIsAiAdviceModeEnabled(value);
        } catch (_error) {
            toast.error("AIアドバイスモードの更新に失敗しました");
        } finally {
            setIsAiUpdating(false);
        }
    };

    const handleSignout = () => {
        setSignOutDialogOpen(true);
    };

    const handleDeleteAccount = () => {
        setDeleteDialogOpen(true);
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <AppHeader title="設定" />

            <main className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0 space-y-6">
                    <SettingsTabs
                        activeTab={activeTab}
                        onChange={setActiveTab}
                    />
                    {activeTab === "account" && (
                        <Card className="rounded-[32px] border-border/70 bg-background/55 shadow-[0_32px_80px_-36px_rgba(15,23,42,0.45)] backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-medium">
                                    アカウント設定
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1">
                                    <SettingItem
                                        icon={User}
                                        label="ユーザー名変更"
                                        onClick={() =>
                                            navigate("/settings/name")
                                        }
                                    />
                                    <SettingItem
                                        icon={Mail}
                                        label="メールアドレス変更"
                                        onClick={() =>
                                            navigate("/settings/email/request")
                                        }
                                    />
                                    <SettingItem
                                        icon={Lock}
                                        label="パスワード再設定"
                                        onClick={() =>
                                            navigate("/settings/password")
                                        }
                                    />
                                    <SettingItem
                                        icon={Wallet}
                                        label="予算管理"
                                        onClick={() =>
                                            navigate("/settings/budget")
                                        }
                                    />
                                    <div className="my-2 border-t border-border" />
                                    <SettingItem
                                        icon={LogOut}
                                        label="サインアウト"
                                        onClick={handleSignout}
                                        variant="danger"
                                    />
                                    <SettingItem
                                        icon={Trash2}
                                        label="アカウント削除"
                                        onClick={handleDeleteAccount}
                                        variant="danger"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "app" && (
                        <Card className="rounded-[32px] border-border/70 bg-background/55 shadow-[0_32px_80px_-36px_rgba(15,23,42,0.45)] backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-medium">
                                    アプリ設定
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1">
                                    <div>
                                        <ToggleItem
                                            icon={BotMessageSquare}
                                            label="AIアドバイスモード"
                                            checked={isAiAdviceModeEnabled}
                                            onChange={handleAiAdviceModeChange}
                                            disabled={isAiAdviceDisabled}
                                            visuallyDisabled={
                                                isAiAdviceVisuallyDisabled
                                            }
                                        />
                                        {!isBudgetEnabled && (
                                            <p className="px-4 pt-1 text-xs text-muted-foreground">
                                                AIアドバイスモードを利用するには予算を設定してください。
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <ToggleItem
                                            icon={isDarkMode ? Moon : Sun}
                                            label="ダークモード"
                                            checked={isDarkMode}
                                            onChange={setIsDarkMode}
                                        />
                                    </div>
                                    <div>
                                        <SettingItem
                                            icon={Globe}
                                            label="言語切り替え"
                                            onClick={() => {}}
                                            disabled={true}
                                            visuallyDisabled={true}
                                        />
                                        <p className="px-4 pt-1 text-xs text-muted-foreground">
                                            ※ 現在ご利用いただけません。
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
            <SignOutDialog
                open={signOutDialogOpen}
                onClose={() => setSignOutDialogOpen(false)}
            />
            <DeleteAccountDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            />
        </div>
    );
}
