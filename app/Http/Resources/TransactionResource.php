<?php
namespace App\Http\Resources;

use App\Http\Resources\CategoryResource;
use App\Http\Resources\PaymentMethodResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'transaction_id'      => $this->id,
            'user_id'             => $this->user_id,
            'transaction_date'    => $this->transaction_date,
            'transaction_type_id' => $this->transaction_type_id,
            'category'            => new CategoryResource($this->whenLoaded('category')),
            'payment_method'      => new PaymentMethodResource($this->whenLoaded('paymentMethod')),
            'amount'              => $this->amount,
            'memo'                => $this->memo,
            'deleted'             => $this->deleted,
            'created_at'          => $this->created_at,
            'updated_at'          => $this->updated_at,
        ];
    }
}
