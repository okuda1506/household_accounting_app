<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use App\Mail\EmailChangeCodeMail;

/**
 * ユーザー関連のビジネスロジックを管理するサービスクラス
 *
 * - updateUserName(): ユーザー名を更新
 * - sendEmailChangeCode(): メールアドレス変更の認証コードを送信
 * - verifyEmailChangeCode(): メールアドレス変更の認証コードを検証
 */
class UserService
{
    /**
     * ユーザー名を更新する
     *
     * @param int $userId
     * @param string $name
     * @return array{user: User}
     * @throws \Exception
     */
    public function updateUserName(int $userId, string $name): array
    {
        $user = User::findOrFail($userId);
        $user->name = $name;
        $user->save();

        return ['user' => $user];
    }

    /**
     * メールアドレス変更の認証コードを送信する
     *
     * @param int $userId
     * @param string $name
     * @return array{user: User}
     * @throws \Exception
     */
    public function sendEmailChangeCode(int $userId, string $newEmail): void
    {
        $code = (string)rand(100000, 999999); // 6桁

        // 5分 TTL で Redis 保存
        Cache::put("email_change_code_{$userId}", [
            'email' => $newEmail,
            'code' => $code,
        ], now()->addMinutes(5));

        Mail::to($newEmail)->send(new EmailChangeCodeMail($code));
    }

    /**
     * メールアドレス変更の認証コードを検証する
     *
     * @param int $userId
     * @param string $email
     * @param string $code
     * @return boolean
     * @throws \Exception
     */
    public function verifyEmailChangeCode(int $userId, string $email, string $code): bool
    {
        $data = Cache::get("email_change_code_{$userId}");

        if (!$data) return false; // コード期限切れ

        return $data['email'] === $email && $data['code'] === $code;
    }

    /**
     * メールアドレスを更新する
     *
     * @param int $userId
     * @param string $email
     * @return array
     * @throws \Exception
     */
    public function updateEmail(int $userId, string $email): User
    {
        $user = User::findOrFail($userId);

        $user->email = $email;
        $user->save();

        Cache::forget("email_change_code_{$userId}");

        return $user;
    }
}
