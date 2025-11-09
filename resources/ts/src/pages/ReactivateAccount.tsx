
import AuthPasswordForm from "../components/auth/AuthPasswordForm";

export default function ReactivateAccount() {
    return (
        <AuthPasswordForm
            pageTitle="アカウントのご利用再開"
            invalidLinkToastMessage="無効なアカウント再開リンクです。再度メールを送信してください。"
            invalidLinkCardTitle="無効なリンク"
            invalidLinkCardContent="お手数ですが、再度パスワード再設定のリクエストをしてください。"
            invalidLinkRedirectPath="/forgot-password"
            apiEndpoint="/reactivate-account"
            successToastMessage="アカウントを再開しました。"
            failureToastMessage="アカウントの再開に失敗しました。"
            successRedirectPath="/login"
            submitButtonText="アカウントを再開"
        />
    );
}
