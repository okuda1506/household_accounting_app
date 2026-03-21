<?php
namespace App\Services\Ai;

use App\Models\User;
use Illuminate\Http\Response;

/**
 * AIアドバイス使用可否を管理するサービスクラス
 */
class AiGuardService
{
    /**
     * AIアドバイスが利用可能か検証する
     *
     * 利用条件:
     * - 予算が設定されていること
     * - AIアドバイスモードが有効であること
     *
     * @param User $user
     * @return void
     *
     * @throws \Exception
     */
    public function assertAiAdviceAvailable(User $user): void
    {
        $this->assertBudgetConfigured($user);

        if (!$user->ai_advice_mode) {
            throw new \Exception(
                __('messages.ai_advice_mode_disabled'),
                Response::HTTP_FORBIDDEN
            );
        }
    }

    /**
     * AIアドバイスモードをONにできるか検証する
     *
     * 利用条件:
     * - 予算が設定されていること
     *
     * @param User $user
     * @return void
     *
     * @throws \Exception
     */
    public function assertAiAdviceCanBeEnabled(User $user): void
    {
        $this->assertBudgetConfigured($user);
    }

    /**
     * AIアドバイス機能の前提条件となる予算設定を検証する
     *
     * 判定条件:
     * - budget が1以上であること（null・0 は未設定扱い）
     *
     * @param User $user
     * @return void
     *
     * @throws \Exception
     */
    private function assertBudgetConfigured(User $user): void
    {
        if (($user->budget ?? 0) <= 0) {
            throw new \Exception(
                __('messages.ai_advice_requires_budget'),
                Response::HTTP_FORBIDDEN
            );
        }
    }
}
