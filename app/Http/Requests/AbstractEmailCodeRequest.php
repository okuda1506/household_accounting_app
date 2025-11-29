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
            'email.required' => 'メールアドレスは必須です。',
            'email.email'    => 'メールアドレスの形式が正しくありません。',
            'email.max'      => 'メールアドレスは255文字以内で入力してください。',
            'code.required'  => '認証コードは必須です。',
            'code.digits'    => '認証コードは6桁で入力してください。',
        ];
    }
}
