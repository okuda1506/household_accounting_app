import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
    AlertTriangle,
    ArrowRight,
    Loader2,
    LockKeyhole,
    Mail,
} from "lucide-react";
import { toast } from "react-toastify";

import api from "../../../lib/axios";
import { extractFieldErrors, type FieldErrors } from "../../../lib/error-response";
import type { AuthPasswordFormProps } from "../../types/auth";
import { AuthShell } from "./AuthShell";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { PasswordInput } from "../ui/password-input";

const inputClassName =
    "h-12 rounded-xl border-border/70 bg-background/80 pl-11 shadow-sm transition focus-visible:border-primary/40 focus-visible:ring-[3px] focus-visible:ring-primary/20 focus-visible:ring-offset-0 dark:bg-background/60";

const linkClassName =
    "inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground";

const AuthPasswordForm = ({
    pageTitle,
    pageDescription,
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
    const [errors, setErrors] = useState<FieldErrors>({});
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [isInvalidLink, setIsInvalidLink] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const passwordMessages = errors.password ?? [];
    const passwordConfirmationMessages = [
        ...(errors.password_confirmation ?? []),
        ...passwordMessages.filter((message) =>
            message.includes("確認用項目と一致しません")
        ),
    ];
    const passwordValidationMessages = passwordMessages.filter(
        (message) => !message.includes("確認用項目と一致しません")
    );

    useEffect(() => {
        if (!token || !email) {
            setIsInvalidLink(true);
            toast.error(invalidLinkToastMessage);
            const timer = setTimeout(
                () => navigate(invalidLinkRedirectPath),
                10000
            );

            return () => clearTimeout(timer);
        }

        setIsInvalidLink(false);
    }, [
        token,
        email,
        navigate,
        invalidLinkToastMessage,
        invalidLinkRedirectPath,
    ]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

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
            setErrors(extractFieldErrors(error, failureToastMessage));
            toast.error(failureToastMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isInvalidLink) {
        return (
            <AuthShell variant="simple">
                <div className="mx-auto w-full max-w-md">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 dark:text-red-300">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                {invalidLinkCardTitle}
                            </h1>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-muted-foreground">
                            {invalidLinkCardContent}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">
                            10秒後に自動で移動します。
                        </p>
                    </div>

                    <div className="mt-8">
                        <Link
                            to={invalidLinkRedirectPath}
                            className={linkClassName}
                        >
                            いますぐ移動する
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </AuthShell>
        );
    }

    return (
        <AuthShell variant="simple">
            <div className="mx-auto w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <LockKeyhole className="h-5 w-5" />
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                            {pageTitle}
                        </h1>
                    </div>
                    {pageDescription && (
                        <p className="mt-4 text-sm leading-7 text-muted-foreground">
                            {pageDescription}
                        </p>
                    )}
                </div>

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

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email">メールアドレス</Label>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    readOnly
                                    className={`${inputClassName} bg-muted/60 text-muted-foreground`}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-start justify-between gap-3">
                                <Label htmlFor="password">
                                    新しいパスワード
                                </Label>
                                {passwordValidationMessages[0] && (
                                    <p className="text-right text-sm text-red-400">
                                        {passwordValidationMessages[0]}
                                    </p>
                                )}
                            </div>
                            <div className="relative">
                                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <PasswordInput
                                    id="password"
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`${inputClassName} ${
                                        passwordValidationMessages.length > 0
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-start justify-between gap-3">
                                <Label htmlFor="password_confirmation">
                                    パスワード確認
                                </Label>
                                {passwordConfirmationMessages[0] && (
                                    <p className="text-right text-sm text-red-400">
                                        {passwordConfirmationMessages[0]}
                                    </p>
                                )}
                            </div>
                            <div className="relative">
                                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <PasswordInput
                                    id="password_confirmation"
                                    autoComplete="new-password"
                                    required
                                    value={passwordConfirmation}
                                    onChange={(e) =>
                                        setPasswordConfirmation(e.target.value)
                                    }
                                    className={`${inputClassName} ${
                                        passwordConfirmationMessages.length > 0
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-12 w-full rounded-xl text-sm font-semibold shadow-lg shadow-primary/25"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    送信中...
                                </>
                            ) : (
                                submitButtonText
                            )}
                        </Button>

                        <Link to="/login" className={linkClassName}>
                            ログイン画面に戻る
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </form>
            </div>
        </AuthShell>
    );
};

export default AuthPasswordForm;
