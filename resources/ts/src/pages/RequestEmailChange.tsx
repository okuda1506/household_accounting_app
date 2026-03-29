import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { NavigationMenuAnchor } from "../components/NavigationModal";

const RequestEmailChange = () => {
    const navigate = useNavigate();
    const [currentEmail, setCurrentEmail] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
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
        setErrors([]);
        setLoading(true);

        try {
            await api.post("/user/email/request", { email });
            toast.success("認証コードを送信しました");
            navigate("/settings/email/verify", { state: { email } });
        } catch (error: any) {
            const messages = error?.response?.data?.messages ?? [
                "認証コードの送信に失敗しました",
            ];
            setErrors(messages);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <nav className="border-b border-border">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative h-16 flex items-center">
                        <span className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold">
                            設定
                        </span>
                        <NavigationMenuAnchor />
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0">
                    <Card className="mx-auto max-w-md border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">
                                メールアドレス変更
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {errors.length > 0 && (
                                    <div className="bg-red-900/30 border border-red-500/50 text-red-400 text-sm p-3 rounded-md">
                                        {errors.map((e, i) => (
                                            <p key={i}>{e}</p>
                                        ))}
                                    </div>
                                )}

                                {currentEmail && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            現在のメールアドレス
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {currentEmail}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm mb-1">
                                        新しいメールアドレス
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        className="w-full rounded border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="pt-6 space-y-3">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full"
                                    >
                                        {loading
                                            ? "送信中..."
                                            : "認証コードを送信"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => navigate("/settings")}
                                        className="w-full"
                                    >
                                        キャンセル
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default RequestEmailChange;
