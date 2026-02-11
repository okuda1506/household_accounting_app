<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBudgetRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'budget'  => ['required', 'integer', 'min:0', 'max:999999999'],
        ];
    }

    public function messages(): array
    {
        return [
            'budget.required' => '予算は必須です。',
            'budget.integer' => '予算は整数で入力してください。',
            'budget.min' => '予算は0以上にしてください。',
            'budget.max' => '予算は999999999以下にしてください。',
        ];
    }
}
