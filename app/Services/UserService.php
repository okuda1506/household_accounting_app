<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use App\Mail\EmailChangeCodeMail;
use App\Exceptions\Domain\InvalidCurrentPasswordException;

/**
 * ユーザー関連のビジネスロジックを管理するサービスクラス
 *
 * - updateUserName(): ユーザー名を更新
 * - sendEmailChangeCode(): メールアドレス変更の認証コードを送信
 * - verifyEmailChangeCode(): メールアドレス変更の認証コードを検証
 * - updateEmail(): メールアドレスを更新
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
        $user = $this->findActiveUser($userId);
        $user->name = $name;
        $user->save();

        return ['user' => $user];
    }

    /**
     * メールアドレス変更の認証コードを送信する
     *
     * @param int $userId
     * @param string $newEmail
     * @return void
     * @throws \Exception
     */
    public function sendEmailChangeCode(int $userId, string $newEmail): void
    {
        $code = (string)random_int(100000, 999999); // 6桁

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

        return $data['email'] === $email && hash_equals((string)$data['code'], $code);
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
        $user = $this->findActiveUser($userId);

        $user->email = $email;
        $user->save();

        Cache::forget("email_change_code_{$userId}");

        return $user;
    }

    /**
     * パスワードを更新する
     *
     * @param int $userId
     * @param string $currentPassword
     * @param string $newPassword
     * @throws InvalidCurrentPasswordException | \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function updatePassword(int $userId, string $currentPassword, string $newPassword): void
    {
        $user = $this->findActiveUser($userId);

        if (!Hash::check($currentPassword, $user->password)) {
            throw new InvalidCurrentPasswordException();
        }

        $user->update([
            'password' => Hash::make($newPassword),
        ]);
    }

    /**
     * ユーザーの予算を更新する
     *
     * @param int $userId
     * @param int $budget
     * @return array{user: User}
     * @throws \Exception
     */
    public function updateBudget(int $userId, int $budget): array
    {
        $user = $this->findActiveUser($userId);
        $user->budget = $budget;
        $user->save();

        return ['user' => $user];
    }

    /**
     * ユーザーのAIアドバイスモードを更新する
     *
     * @param int $userId
     * @param bool $aiAdviceMode
     * @return User
     * @throws \Exception
     */
    public function updateAiAdviceMode(int $userId, bool $aiAdviceMode): User
    {
        $user = $this->findActiveUser($userId);
        $user->ai_advice_mode = $aiAdviceMode;
        $user->save();

        return $user;
    }


    /**
     * 有効なユーザーを取得する
     *
     * @param int $userId
     * @return User
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    private function findActiveUser(int $userId): User
    {
        return User::where('id', $userId)
            ->where('deleted', 0)
            ->firstOrFail();
    }
}
