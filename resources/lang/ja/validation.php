<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'unique' => ':attributeは既に使用されています。',
    'email' => '有効なメールアドレス形式を指定してください。',
    'confirmed' => ':attributeが確認用項目と一致しません。',
    'required' => ':attributeは必須項目です。',
    'current_password' => 'パスワードを正しく入力してください。',
    'min' => [
        'string' => ':attributeは:min文字以上で入力してください。',
    ],
    'max' => [
        'string' => ':attributeは:max文字以内で入力してください。',
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    */

    'attributes' => [
        'name' => 'ユーザー名',
        'email' => 'メールアドレス',
        'password' => 'パスワード',
        'current_password' => '現在のパスワード',
        'new_password' => '新しいパスワード',
        'new_password_confirmation' => '新しいパスワード（確認用）',
    ],
];
