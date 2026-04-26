<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RequestEmailChangeRequest extends FormRequest
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
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => '入力してください。',
            'email.email' => '形式が正しくありません。',
            'email.max' => '255文字以内で入力してください。',
            'email.unique' => '既に使用されています。',
        ];
    }
}
