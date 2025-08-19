<?php
namespace App\Services;

use App\Models\Transaction;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

/**
 * 取引関連のビジネスロジックを管理するサービスクラス
 *
 * - createTransaction(): 新しい取引を作成
 * - updateTransaction(): 既存の取引を更新
 * - deleteTransaction(): 取引を論理削除
 * - findTransactionByIdAndUser(): 指定ユーザーの取引を取得（共通メソッド）
 */
class TransactionService
{
    // 削除フラグOFF
    const IS_NOT_DELETED = 0;

    /**
     * 取引一覧を取得する
     *
     * @param array $data カテゴリデータ
     * @param int $userId ユーザーID
     *
     * @return Collection
     */
    public function getTransactions(int $userId): Collection
    {
        try {
            return Transaction::with([
                'category'      => function ($query) use ($userId): void {
                    $query
                        ->where('user_id', $userId)
                        ->where('deleted', false)
                        ->orderBy('sort_no');
                    ;
                },
                'paymentMethod' => function ($query) use ($userId): void {
                    $query->where('deleted', false);
                },
            ])
                ->where('user_id', $userId)
                ->where('deleted', false)
                ->orderBy('transaction_date')
                ->get();

        } catch (\Exception $e) {
            throw new \Exception(__('messages.category_get_failed'), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 取引データの新規登録
     *
     * @param array $data 取引データ
     * @param int $userId ユーザーID
     *
     * @return Transaction
     */
    public function createTransaction(array $data, int $userId): Transaction
    {
        $data['user_id'] = $userId;

        try {
            DB::beginTransaction();
            $transaction = Transaction::create($data);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return $transaction;
    }

    /**
     * 取引データの更新
     *
     * @param string $transactionId 取引ID
     * @param array $data 取引データ
     * @param int $userId ユーザーID
     *
     * @return Transaction
     */
    public function updateTransaction(string $transactionId, array $data, int $userId): Transaction
    {
        $transaction = $this->findTransactionByIdAndUser($transactionId, $userId);

        try {
            DB::beginTransaction();
            $transaction->update($data);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return $transaction;
    }

    /**
     * 取引データの削除
     *
     * @param string $transactionId 取引ID
     * @param int $userId ユーザーID
     *
     * @return void
     */
    public function deleteTransaction(string $transactionId, int $userId): void
    {
        $transaction = $this->findTransactionByIdAndUser($transactionId, $userId);

        try {
            DB::beginTransaction();
            $transaction->delete();
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * 指定された取引IDとユーザーIDに一致する取引を取得する
     *
     * @param string $transactionId 取引ID
     * @param int $userId ユーザーID
     * @return Transaction
     * @throws \Exception
     */
    private function findTransactionByIdAndUser(string $transactionId, int $userId): Transaction
    {
        try {
            return Transaction::where('id', $transactionId)
                ->where('user_id', $userId)
                ->where('deleted', self::IS_NOT_DELETED)
                ->firstOrFail();
        } catch (ModelNotFoundException $e) {
            throw new \Exception(__('messages.transaction_not_found'), Response::HTTP_NOT_FOUND);
        }
    }
}
