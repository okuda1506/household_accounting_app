<?php
namespace App\Services;

use App\Models\PaymentMethod;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Response;

/**
 * 支払方法関連のビジネスロジックを管理するサービスクラス
 *
 * - getPaymentMethods(): 支払い方法一覧を取得
 */
class PaymentMethodService
{
    /**
     * 支払い方法一覧を取得する
     *
     * @return Collection
     */
    public function getPaymentMethods(): Collection
    {
        try {
            return PaymentMethod::where('deleted', false)
                ->orderBy('id')
                ->get();
        } catch (\Exception $e) {
            throw new \Exception(__('messages.payment_method_get_failed'), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
