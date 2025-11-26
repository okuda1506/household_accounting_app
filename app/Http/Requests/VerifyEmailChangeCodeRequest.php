<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VerifyEmailChangeCodeRequest extends FormRequest
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
            'email' => [
                'required',
                'string',
                'email:strict',
                'max:255',
                'unique:users,email',
            ],
            'code'  => [
                'required',
                'digits:6',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required'  => 'メールアドレスは必須です。',
            'email.email'     => 'メールアドレスの形式が正しくありません。',
            'email.max'       => 'メールアドレスは255文字以内で入力してください。',
            'email.unique'    => 'このメールアドレスは既に使用されています。',
            'code.required'   => '認証コードは必須です。',
            'code.digits'     => '認証コードは6桁で入力してください。',
        ];
    }
}
