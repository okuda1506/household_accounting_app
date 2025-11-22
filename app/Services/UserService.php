<?php

namespace App\Services;

use App\Models\User;

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

}
