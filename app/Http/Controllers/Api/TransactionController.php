<?php
namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\TransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Services\TransactionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class TransactionController extends Controller
{
    private TransactionService $transactionService;

    public function __construct(TransactionService $transactionService)
    {
        $this->transactionService = $transactionService;
    }

    /**
     * 取引一覧
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        // todo: serviceに移行
        try {
            $transactions = TransactionResource::collection(
                $this->transactionService->getTransactions(auth()->id())
            );
        } catch (\Exception $e) {
            return ApiResponse::error(null, [__('messages.transaction_get_failed')], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return ApiResponse::success($transactions, __('messages.transaction_list_fetched'));
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
            return ApiResponse::error(null, [$e->getMessage()], (int) $e->getCode() ?: Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return ApiResponse::success(new TransactionResource($transaction), __('messages.transaction_created'));
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
            return ApiResponse::error(null, [$e->getMessage()], (int) $e->getCode() ?: Response::HTTP_INTERNAL_SERVER_ERROR);
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
            $this->transactionService->deleteTransaction($transactionId, auth()->id());
        } catch (\Exception $e) {
            return ApiResponse::error(null, [$e->getMessage()], (int) $e->getCode() ?: Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return ApiResponse::success(null, __('messages.transaction_deleted'));
    }
}
