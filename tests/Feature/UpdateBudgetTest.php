<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UpdateBudgetTest extends TestCase
{
    use RefreshDatabase;

    /**
     * 正常系: 予算を正常に更新できる
     */
    public function test_user_can_update_budget(): void
    {
        // 1. ユーザー作成（初期予算 100,000）
        $user = User::factory()->create(['budget' => 100000]);

        // 2. API実行（50,000に変更）
        $response = $this->actingAs($user)
            ->putJson(route('api.user.update_budget'), [
                'budget' => 50000,
            ]);

        // 3. 検証
        $response->assertOk()
            ->assertJson(['message' => '予算を更新しました。']);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'budget' => 50000,
        ]);
    }

    /**
     * 異常系: 未認証ユーザーは更新できない
     */
    public function test_guest_cannot_update_budget(): void
    {
        $response = $this->putJson(route('api.user.update_budget'), [
            'budget' => 50000,
        ]);

        $response->assertUnauthorized();
    }

    /**
     * 異常系: バリデーションエラー（マイナス値）
     */
    public function test_budget_must_be_zero_or_more(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->putJson(route('api.user.update_budget'), [
                'budget' => -100,
            ]);

        $response->assertUnprocessable(); // 422
    }

    /**
     * 異常系: バリデーションエラー（上限超え）
     */
    public function test_budget_must_be_within_limit(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->putJson(route('api.user.update_budget'), [
                'budget' => 1000000000, // 10億（上限は999,999,999）
            ]);

        $response->assertUnprocessable();
    }
}
