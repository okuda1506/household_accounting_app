import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { AuthPasswordFormProps } from "../../types/auth";
import { toast } from "react-toastify";
import api from "../../../lib/axios";
import { AlertTriangle } from "lucide-react";
import {
    Button,
} from "../ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../ui/card";

const AuthPasswordForm = ({
    pageTitle,
    invalidLinkToastMessage,
    invalidLinkCardTitle,
    invalidLinkCardContent,
    invalidLinkRedirectPath,
    apiEndpoint,
    successToastMessage,
    failureToastMessage,
    successRedirectPath,
    submitButtonText,
}: AuthPasswordFormProps) => {
    const { token } = useParams<{ token: string }>();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") || "";
    const [errors, setErrors] = useState<string[]>([]);
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [isInvalidLink, setIsInvalidLink] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token || !email) {
            setIsInvalidLink(true);
            toast.error(invalidLinkToastMessage);
            setTimeout(() => navigate(invalidLinkRedirectPath), 10000);
        } else {
            setIsInvalidLink(false);
        }
    }, [
        token,
        email,
        navigate,
        invalidLinkToastMessage,
        invalidLinkRedirectPath,
    ]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        try {
            await api.post(apiEndpoint, {
                email,
                token,
                password,
                password_confirmation: passwordConfirmation,
            });
            toast.success(successToastMessage);
            navigate(successRedirectPath);
        } catch (error: any) {
            console.log(error);
            setErrors(error.response.data.messages);
            toast.error(failureToastMessage);
        }
    };

    if (isInvalidLink) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
                <Card className="relative w-full max-w-md border-border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-center text-lg font-semibold text-red-400">
                            {invalidLinkCardTitle}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-muted-foreground">
                        {invalidLinkCardContent}
                        <br />
                        10秒後にパスワード再設定画面へ移動します。
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
            <Card className="relative w-full max-w-md border-border shadow-sm">
                <CardHeader>
                    <CardTitle className="text-center text-lg font-semibold">
                        {pageTitle}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {errors.length > 0 && (
                            <div className="bg-red-900/30 border border-red-500/50 text-red-400 text-sm p-3 rounded-md flex items-center space-x-2">
                                <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
                                <div>
                                    {errors.map((error, index) => (
                                        <p key={index}>{error}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="mb-1 block text-sm text-foreground">
                                メールアドレス
                            </label>
                            <input
                                type="email"
                                value={email}
                                disabled
                                className="w-full rounded border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm text-foreground">
                                新しいパスワード
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm text-foreground">
                                パスワード確認
                            </label>
                            <input
                                type="password"
                                value={passwordConfirmation}
                                onChange={(e) =>
                                    setPasswordConfirmation(e.target.value)
                                }
                                className="w-full rounded border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="pt-2">
                            <Button type="submit" className="w-full">
                                {submitButtonText}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AuthPasswordForm;
