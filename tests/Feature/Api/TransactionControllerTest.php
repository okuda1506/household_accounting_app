<?php

namespace Tests\Feature\Api;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use App\Services\TransactionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Response;
use Mockery;
use Mockery\MockInterface;
use Tests\TestCase;

class TransactionControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private MockInterface $transactionServiceMock;

    protected function setUp(): void
    {
        parent::setUp();

        // テスト用のユーザーを作成（コミットテスト）
        $this->user = User::factory()->create();

        // TransactionServiceをモック化し、サービスコンテナに束縛
        $this->transactionServiceMock = Mockery::mock(TransactionService::class);
        $this->app->instance(TransactionService::class, $this->transactionServiceMock);
    }

    /**
     * @test
     * @group TransactionController
     */
    public function index_認証済みユーザーは取引一覧を正しく取得できる(): void
    {
         // 準備: サービスが返すダミーの取引データを作成します。
        // .make()ではDBに保存されずidが採番されないため、
        // TransactionResourceがidを必要とすることを考慮し、.create()でDBに保存します。
        $category = Category::factory()->create(['user_id' => $this->user->id]);
        // ダミーの取引データを作成
        $transactions = Transaction::factory()->count(3)->create(['user_id' => $this->user->id, 'category_id' => $category->id]);


        // 期待: サービスが正しい引数で呼び出され、ダミーデータを返すように設定
        $this->transactionServiceMock
            ->shouldReceive('getTransactions')
            ->once()
            ->with($this->user->id)
            ->andReturn($transactions);

        // 実行: APIエンドポイントにリクエストを送信
        $response = $this->actingAs($this->user, 'sanctum')->getJson('/api/transactions');

        // 検証: ステータスコードとJSONの構造が期待通りであることを確認
        $response->assertStatus(Response::HTTP_OK)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['transaction_id', 'transaction_date', 'amount', 'memo'],
                ],
                'message',
            ])
            ->assertJsonCount(3, 'data');
    }

    /**
     * @test
     * @group TransactionController
     */
    public function store_認証済みユーザーは新しい取引を登録できる(): void
    {
        // 準備: リクエストデータと、サービスが返すダミーの作成済み取引データ
        $category = Category::factory()->create(['user_id' => $this->user->id]);
        $requestData = [
            'transaction_date' => '2023-10-27',
            'transaction_type_id' => 2,
            'category_id' => $category->id,
            'amount' => 1500,
            'memo' => '夕食',
        ];
        // サービスが返すモデルはidを持つため、make()の後にidをセットする
        $newTransaction = Transaction::factory()->make(array_merge($requestData, ['user_id' => $this->user->id]));
        // UUIDなど、実際のid形式に合わせるとより良い
        $newTransaction->id = 'txn_test_id_12345';

        // 期待: サービスが正しい引数で呼び出され、ダミーデータを返すように設定
        $this->transactionServiceMock
            ->shouldReceive('createTransaction')
            ->once()
            ->with($requestData, $this->user->id)
            ->andReturn($newTransaction);

        // 実行
        $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/transactions', $requestData);

        // 検証
        $response->assertStatus(Response::HTTP_OK) // ApiResponse::successはデフォルトで200を返す
            ->assertJson([
                'data' => ['transaction_id' => $newTransaction->id],
                'data' => [
                    'memo' => '夕食',
                    'amount' => 1500.00, // amountはdecimal:2でキャストされるため
                ],
                'message' => __('messages.transaction_created'),
            ]);
    }

    /**
     * @test
     * @group TransactionController
     */
    public function store_バリデーションエラーの場合は422エラーが返る(): void
    {
        // 準備: amountが必須なのに送らない不正なリクエスト
        $invalidData = [
            'transaction_date' => '2023-10-27',
            'memo' => '夕食',
        ];

        // 実行
        $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/transactions', $invalidData);

        // 検証
        $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY)
            ->assertJsonValidationErrors(['amount', 'transaction_type_id', 'category_id']);
    }

    /**
     * @test
     * @group TransactionController
     */
    public function update_認証済みユーザーは自身の取引を更新できる(): void
    {
        // 準備
        $transaction = Transaction::factory()->create(['user_id' => $this->user->id]);
        $updateData = ['memo' => '更新されたメモ'];
        $updatedTransaction = clone $transaction;
        $updatedTransaction->memo = $updateData['memo'];

        // 期待
        $this->transactionServiceMock
            ->shouldReceive('updateTransaction')
            ->once()
            ->with($transaction->id, \Mockery::on(function ($arg) use ($updateData) {
                return $arg['memo'] === $updateData['memo'];
            }), $this->user->id)
            ->andReturn($updatedTransaction);

        // 実行
        $response = $this->actingAs($this->user, 'sanctum')->putJson("/api/transactions/{$transaction->id}", $updateData);

        // 検証
        $response->assertStatus(Response::HTTP_OK)
            ->assertJsonPath('data.memo', '更新されたメモ')
            ->assertJsonPath('message', __('messages.transaction_updated'));
    }

    /**
     * @test
     * @group TransactionController
     */
    public function destroy_認証済みユーザーは自身の取引を削除できる(): void
    {
        // 準備
        $transaction = Transaction::factory()->create(['user_id' => $this->user->id]);

        // 期待
        $this->transactionServiceMock
            ->shouldReceive('deleteTransaction')
            ->once()
            ->with($transaction->id, $this->user->id);

        // 実行
        $response = $this->actingAs($this->user, 'sanctum')->deleteJson("/api/transactions/{$transaction->id}");

        // 検証
        $response->assertStatus(Response::HTTP_OK)
            ->assertJson([
                'data' => null,
                'message' => __('messages.transaction_deleted'),
            ]);
    }
}
