<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\CategoryBelongsToTransactionType;

class TransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // todo: 認証機能実装してからリクエストの実行権限ロジックを書く
        return true;
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
            'user_id' => 'required|integer|exists:users,id',
            'transaction_date' => 'required|date_format:Y/m/d',
            'transaction_type_id' => 'required|integer|exists:transaction_types,id',
            'category_id' => [
                'required',
                'integer',
                'exists:categories,id',
                new CategoryBelongsToTransactionType($transactionTypeId)
            ],
            'amount' => 'required|numeric|min:0',
            'payment_method_id' => 'required|integer|exists:payment_methods,id',
            'memo' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => __('messages.user_id_required'),
            'user_id.integer' => __('messages.user_id_integer'),
            'user_id.exists' => __('messages.user_id_exists'),

        ];
    }
}
