<?php

namespace App\Services;

use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TransactionService
{
    /**
     * 新規登録
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
     * 更新
     *
     * @param string $transactionId 取引ID
     * @param array $data 取引データ
     * @param int $userId ユーザーID
     *
     * @return Transaction
     */
    public function updateTransaction(string $transactionId, array $data, int $userId): Transaction
    {
        try {
            $transaction = Transaction::where('id', $transactionId)
                ->where('user_id', $userId)
                ->firstOrFail();
        } catch (ModelNotFoundException $e) {
            throw new \Exception(__('messages.transaction_not_found'), Response::HTTP_NOT_FOUND);
        }

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
     * 削除
     *
     * @param string $transactionId カテゴリID
     * @param int $userId ユーザーID
     *
     * @return void
     */
    public function deleteTransaction(string $transactionId, int $userId): void
    {

    }

}
