<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\TransactionRequest;
use App\Services\TransactionService;
use App\Http\Resources\TransactionResource;
use Illuminate\Http\Response;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use SebastianBergmann\Type\FalseType;

class TransactionController extends Controller
{
    private TransactionService $transactionService;

    public function __construct(TransactionService $transactionService)
    {
        $this->transactionService = $transactionService;
    }

    /**
     * 有効な取引の取得
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $transactions = TransactionResource::collection(
                Transaction::where('deleted', false)->get()
            );
        } catch (\Exception $e) {
            $errorMessages = [];
            $errorMessages[] = __('messages.transaction_get_failed');

            return ApiResponse::error(null, $errorMessages, Response::HTTP_INTERNAL_SERVER_ERROR);
        }

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
        try {
            $transaction = $this->transactionService->createTransaction($request->validated(), auth()->id());
        } catch (\Exception $e) {
            return ApiResponse::error(null, [$e->getMessage()], (int)$e->getCode() ?: Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return ApiResponse::success(new TransactionResource($transaction),  __('messages.transaction_created'));
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
    public function update(TransactionRequest $request, string $transactionId): JsonResponse
    {
        try {
            $transaction = $this->transactionService->updateTransaction($transactionId, $request->validated(), auth()->id());
        } catch (\Exception $e) {
            return ApiResponse::error(null, [$e->getMessage()], (int)$e->getCode() ?: Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return ApiResponse::success(new TransactionResource($transaction), __('messages.transaction_updated'));
    }

    /**
     * 取引の削除
     *
     * @param TransactionRequest $request
     * @param string $transactionId
     *
     * @return JsonResponse
     */
    public function destroy(string $transactionId): JsonResponse
    {
        try {
            $transaction = Transaction::findOrFail($transactionId);
            $transaction->delete();
        } catch (\Exception $e) {
            $errorMessages = [];
            $errorMessages[] = __('messages.transaction_destroy_failed');

            return ApiResponse::error(null, $errorMessages, Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $message = __('messages.category_deleted');

        return ApiResponse::success(new TransactionResource($transaction), $message);
    }
}
