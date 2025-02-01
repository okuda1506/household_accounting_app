<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\TransactionRequest;
use App\Http\Resources\TransactionResource;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Database\Eloquent\Collection;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use SebastianBergmann\Type\FalseType;

class TransactionController extends Controller
{
    /**
     * 有効な取引の取得
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $transactions = TransactionResource::collection(
            Transaction::where('deleted', false)->get()
        );

        $message = __('messages.transaction_list_fetched');

        return ApiResponse::success($transactions, $message);
    }

    /**
     * 取引の新規登録
     *
     * @param TransactionRequest $request
     *
     * @return JsonResponse
     */
    public function store(TransactionRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $transaction = Transaction::create($validated);
        $message = __('messages.transaction_created');

        return ApiResponse::success(new TransactionResource($transaction), $message);
    }

    /**
     * 取引の更新
     *
     * @param TransactionRequest $request
     *
     * @param string $id
     *
     * @return JsonResponse
     */
    public function update(TransactionRequest $request, string $id): JsonResponse
    {
        $validated = $request->validated();

        $transaction = Transaction::where(['id' => $id, 'deleted' => false])->firstOrFail();

        $transaction->update($validated);
        $message = __('messages.category_updated');

        return ApiResponse::success(new TransactionResource($transaction), $message);
    }

    /**
     * 取引の削除
     *
     * @param TransactionRequest $request
     *
     * @param string $id
     *
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        $transaction = Transaction::findOrFail($id);

        $transaction->delete();

        $message = __('messages.category_deleted');

        return ApiResponse::success(new TransactionResource($transaction), $message);
    }
}
