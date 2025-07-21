<?php
namespace App\Http\Requests;

use App\Models\PaymentMethod;
use App\Models\Transaction;
use App\Rules\CategoryBelongsToTransactionType;
use Closure;
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
            'transaction_date'    => 'required|date_format:Y/m/d',
            'transaction_type_id' => 'required|integer|exists:transaction_types,id',
            'category_id'         => [
                'required',
                'integer',
                'exists:categories,id',
                new CategoryBelongsToTransactionType($transactionTypeId),
            ],
            'amount'              => 'required|numeric|min:0',
            'payment_method_id'   => [
                'required',
                'integer',
                function (string $attribute, mixed $value, Closure $fail) use ($transactionTypeId) {
                    $exists = PaymentMethod::where('id', $value)
                        ->where('transaction_type_id', $transactionTypeId)
                        ->exists();
                    if (!$exists) {
                        $fail(__('messages.invalid_payment_method_for_transaction_type'));
                    }
                },
            ],
            'memo'                => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => __('messages.user_id_required'),
            'user_id.integer'  => __('messages.user_id_integer'),
            'user_id.exists'   => __('messages.user_id_exists'),

        ];
    }
}
