<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAiAdviceModeRequest extends FormRequest
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
            'ai_advice_mode'  => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'ai_advice_mode.required' => 'AIアドバイスモードのフラグは必須です。',
            'ai_advice_mode.boolean' => 'AIアドバイスモードのフラグはtrueまたはfalseで入力してください。',
        ];
    }
}
