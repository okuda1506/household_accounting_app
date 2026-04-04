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
            'budget'  => ['bail', 'required', 'regex:/^-?\d+$/', 'numeric', 'min:1', 'max:999999999'],
        ];
    }

    public function messages(): array
    {
        return [
            'budget.required' => '入力してください。',
            'budget.regex' => '整数で入力してください。',
            'budget.numeric' => '整数で入力してください。',
            'budget.min' => '0以上にしてください。',
            'budget.max' => '999999999以下にしてください。',
        ];
    }
}
