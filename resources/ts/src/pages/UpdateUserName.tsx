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
import { X } from "lucide-react";

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
            const response = await api.put("/user/name", {
                name,
            });

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
                                ユーザー名変更
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {errors.length > 0 && (
                                    <div className="bg-red-900/30 border border-red-500/50 text-red-400 text-sm p-3 rounded-md">
                                        {errors.map((error, index) => (
                                            <p key={index}>{error}</p>
                                        ))}
                                    </div>
                                )}

                                {currentName && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            現在のユーザー名
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {currentName}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm mb-1"
                                    >
                                        ユーザー名
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="name"
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            className="w-full rounded border border-input bg-background px-3 py-2 pr-10 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        {name && (
                                            <button
                                                type="button"
                                                onClick={() => setName("")}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                                                aria-label="Clear input"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-6 space-y-3">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full"
                                    >
                                        {loading ? "変更中..." : "変更する"}
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

export default UpdateUserName;
