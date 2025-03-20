<?php
namespace App\Http\Resources;

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
            'user_id'             => $this->user_id,
            'transaction_date'    => $this->transaction_date,
            'transaction_type_id' => $this->transaction_type_id,
            'category_id'         => $this->category_id,
            'amount'              => $this->amount,
            'payment_method_id'   => $this->payment_method_id,
            'memo'                => $this->memo,
            'deleted'             => $this->deleted,
            'created_at'          => $this->created_at,
            'updated_at'          => $this->updated_at,
        ];
    }
}
