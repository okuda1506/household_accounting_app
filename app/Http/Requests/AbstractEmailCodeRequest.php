<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

abstract class AbstractEmailCodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'string',
                'email:strict',
                'max:255',
            ],
            'code' => [
                'required',
                'digits:6',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => '入力してください。',
            'email.email' => '形式が正しくありません。',
            'email.max' => '255文字以内で入力してください。',
            'code.required' => '入力してください。',
            'code.digits' => '6桁で入力してください。',
        ];
    }
}
