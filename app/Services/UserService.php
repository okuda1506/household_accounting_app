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
        $code = rand(100000, 999999); // 6桁

        // 5分 TTL で Redis 保存
        Cache::put("email_change_code_{$userId}", [
            'email' => $newEmail,
            'code' => $code,
        ], now()->addMinutes(5));

        Mail::to($newEmail)->send(new EmailChangeCodeMail($code));
    }
}
