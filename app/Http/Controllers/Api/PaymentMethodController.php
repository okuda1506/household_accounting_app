<?php
namespace App\Http\Controllers\Api;

use Illuminate\Http\Response;
use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentMethodResource;
use App\Services\PaymentMethodService;
use Illuminate\Http\JsonResponse;

class PaymentMethodController extends Controller
{
    private PaymentMethodService $paymentMethodService;

    public function __construct(PaymentMethodService $paymentMethodService)
    {
        $this->paymentMethodService = $paymentMethodService;
    }

    /**
     * 支払方法一覧を取得する
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $paymentMethods = PaymentMethodResource::collection(
                $this->paymentMethodService->getPaymentMethods()
            );
        } catch (\Exception $e) {
            return ApiResponse::error(null, [__('messages.payment_method_get_failed')], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return ApiResponse::success($paymentMethods, __('messages.payment_method_list_fetched'));
    }
}
