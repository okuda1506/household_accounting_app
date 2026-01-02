import { useState } from "react";
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
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { NavigationModal } from "../components/NavigationModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../lib/axios";
import DeleteAccountDialog from "../components/DeleteAccountDialog";

type SettingsTab = "account" | "app";

const SettingsTabs = ({
    activeTab,
    onChange,
}: {
    activeTab: SettingsTab;
    onChange: (tab: SettingsTab) => void;
}) => {
    return (
        <div className="relative bg-gray-800 rounded-full p-1 w-full max-w-md mx-auto mb-6">
            {/* スライド時のbg */}
            <div
                className={`absolute top-1 left-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full bg-gray-700 transition-transform duration-300 ease-out ${
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
                        activeTab === "account" ? "text-white" : "text-gray-400"
                    }`}
                >
                    アカウント設定
                </button>
                <button
                    onClick={() => onChange("app")}
                    className={`px-6 py-2 text-sm font-medium rounded-full transition-colors ${
                        activeTab === "app" ? "text-white" : "text-gray-400"
                    }`}
                >
                    アプリ設定
                </button>
            </div>
        </div>
    );
};

const SettingItem = ({ icon: Icon, label, onClick, variant = "default" }) => {
    const textColor = variant === "danger" ? "text-red-400" : "text-white";
    const iconColor = variant === "danger" ? "text-red-400" : "text-gray-400";

    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-900 transition-colors rounded-lg group"
        >
            <div className="flex items-center gap-3">
                <Icon size={20} className={iconColor} />
                <span className={`${textColor} text-sm font-medium`}>
                    {label}
                </span>
            </div>
            <ChevronRight
                size={20}
                className="text-gray-600 group-hover:text-gray-400 transition-colors"
            />
        </button>
    );
};

const ToggleItem = ({ icon: Icon, label, checked, onChange }) => {
    return (
        <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
                <Icon size={20} className="text-gray-400" />
                <span className="text-white text-sm font-medium">{label}</span>
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    checked ? "bg-blue-600" : "bg-gray-700"
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
};

export default function Settings() {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<SettingsTab>("account");
    const navigate = useNavigate();

    const handleClick = (item) => {
        console.log(`${item} clicked`);
        // ここで後からモーダルを開く処理を追加
    };

    const handleToggle = (value) => {
        console.log(`Dark mode toggled: ${value}`);
        // ここで後からダークモード切り替え処理を追加
    };

    const handleSignout = async () => {
        try {
            const response = await api.post("/logout");
            localStorage.removeItem("access_token");
            toast.success(response.data.message);
            navigate("/login", { replace: true });
        } catch (error) {
            toast.error("サインアウトに失敗しました。");
        }
    };

    const handleDeleteAccount = () => {
        setDeleteDialogOpen(true);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <nav className="border-b border-gray-800">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative h-16 flex items-center">
                        <span className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold">
                            設定
                        </span>
                        <div className="absolute right-0">
                            <NavigationModal />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0 space-y-6">
                    <SettingsTabs
                        activeTab={activeTab}
                        onChange={setActiveTab}
                    />
                    {activeTab === "account" && (
                        <Card className="bg-black border-gray-800">
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
                                    <div className="border-t border-gray-800 my-2" />
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
                        <Card className="bg-black border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-lg font-medium">
                                    アプリ設定
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1">
                                    <SettingItem
                                        icon={Globe}
                                        label="言語切り替え"
                                        onClick={() =>
                                            handleClick("言語切り替え")
                                        }
                                    />
                                    <ToggleItem
                                        icon={Moon}
                                        label="ダークモード"
                                        checked={true}
                                        onChange={handleToggle}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
            <DeleteAccountDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            />
        </div>
    );
}
