<?php
namespace App\Http\Requests;

use App\Models\PaymentMethod;
use App\Models\Transaction;
use App\Rules\CategoryBelongsToTransactionType;
use App\Rules\PaymentMethodBelongsToTransactionType;
use Illuminate\Foundation\Http\FormRequest;

class TransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if (! auth()->check()) {
            return false;
        }

        if ($this->routeIs('api.transaction.store')) {
            return true;
        }

        // 更新・削除は自身のデータのみ許可
        if ($this->routeIs('api.transaction.update') || $this->routeIs('api.transaction.destroy')) {
            $transactionId = $this->route('id');
            return Transaction::where('id', $transactionId)
                ->where('user_id', auth()->id())
                ->exists();
        }

        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $transactionTypeId = $this->input('transaction_type_id');

        return [
            'transaction_date'    => 'required|date',
            'transaction_type_id' => 'required|integer|exists:transaction_types,id',
            'category_id'         => [
                'bail',
                'integer',
                'exists:categories,id',
                new CategoryBelongsToTransactionType($transactionTypeId),
            ],
            'amount'              => 'required|numeric|min:0',
            'payment_method_id'   => [
                'bail',
                'integer',
                'exists:payment_methods,id',
                new PaymentMethodBelongsToTransactionType($transactionTypeId),
            ],
            'memo'                => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'transaction_date.required' => __('messages.transaction_date_required'),
            'transaction_date.date_format' => __('messages.transaction_date_date_format'),
            'transaction_type_id.required' => __('messages.transaction_type_id_required'),
            'transaction_type_id.integer'  => __('messages.transaction_type_id_integer'),
            'transaction_type_id.exists'   => __('messages.transaction_type_id_exists'),
            'category_id.required' => __('messages.category_id_required'),
            'category_id.exists' => __('messages.category_id_exists'),
            'amount.required' => __('messages.amount_required'),
            'amount.numeric' => __('messages.amount_numeric'),
            'amount.min' => __('messages.amount_min'),
            'payment_method_id.required' => __('messages.payment_method_id_required'),
            'payment_method_id.exists' => __('messages.payment_method_id_exists'),
            'memo.string' => __('messages.memo_string'),
            'memo.max' => __('messages.memo_max'),
        ];
    }
}
