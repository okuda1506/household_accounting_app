import AuthPasswordForm from "../components/auth/AuthPasswordForm";

export default function ResetPassword() {
    return (
        <AuthPasswordForm
            pageTitle="パスワード再設定"
            invalidLinkToastMessage="無効なパスワード再設定リンクです。再度メールを送信してください。"
            invalidLinkCardTitle="無効なリンク"
            invalidLinkCardContent="お手数ですが、再度パスワード再設定のリクエストをしてください。"
            invalidLinkRedirectPath="/forgot-password"
            apiEndpoint="/reset-password"
            successToastMessage="パスワードの再設定が完了しました。"
            failureToastMessage="パスワードの再設定に失敗しました。"
            successRedirectPath="/login"
            submitButtonText="パスワードを再設定"
        />
    );
}
