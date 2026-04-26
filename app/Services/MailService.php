<?php

namespace App\Services;

use App\Mail\EmailChangeCodeMail;
use Illuminate\Support\Facades\Mail;

/**
 * メール送信関連のビジネスロジックを管理するサービスクラス
 *
 * - sendEmailChangeCodeVerification(): メールアドレス変更の認証コードを送信
 */
class MailService
{
    /**
     * メールアドレス変更の認証コードを送信する
     *
     * @param string $toEmail 送信先メールアドレス
     * @param string $code 認証コード
     * @return void
     */
    public function sendEmailChangeCodeVerification(string $toEmail, string $code): void
    {
        Mail::to($toEmail)->send(new EmailChangeCodeMail($code));
    }
}
