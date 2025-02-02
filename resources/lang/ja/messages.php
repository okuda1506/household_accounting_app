<?php

return [
    // --------------------------
    // 処理成功メッセージ
    // --------------------------
    'category_list_fetched' => 'カテゴリ一覧を取得しました。',
    'category_created' => 'カテゴリを登録しました。',
    'category_updated' => 'カテゴリを更新しました。',
    'category_deleted' => 'カテゴリを削除しました。',
    'transaction_list_fetched' => 'カテゴリ一覧を取得しました。',
    'transaction_created' => '取引を登録しました。',
    'transaction_updated' => '取引を更新しました。',
    'transaction_deleted' => '取引を削除しました。',

    // --------------------------
    // バリデーションメッセージ
    // --------------------------
    'user_id_required' => 'ユーザーIDは必須です。',
    'user_id_integer' => 'ユーザーIDは数値でなければなりません。',
    'user_id_exists' => '無効なユーザーIDです。',
    'name_required' => 'カテゴリ名は必須です。',
    'name_string' => 'カテゴリ名は文字列でなければなりません。',
    'name_max_30' => 'カテゴリ名は30字以内にしてください。',
    'transaction_type_id_required' => '取引タイプIDは必須です。',
    'transaction_type_id_integer' => '取引タイプIDは数値でなければなりません。',
    'transaction_type_id_exists' => '無効な取引タイプIDです。',
    'sort_no_required' => 'ソート順は必須です。',
    'sort_no_integer' => 'ソート順は数値でなければなりません。',
    'sorted_category_ids.required' => 'カテゴリIDのリストは必須です。',
    'sorted_category_ids.array' => 'カテゴリIDのリストは配列で指定してください。',
    'sorted_category_ids.*.integer' => 'カテゴリIDは整数で指定してください。',
    'sorted_category_ids.*.exists' => '指定されたカテゴリIDが存在しません。',

    // --------------------------
    // カスタムバリデーションメッセージ
    // --------------------------
    'invalid_category_for_transaction_type' => '選択されたカテゴリは指定された取引タイプに対応していません。',

    // --------------------------
    // エラーメッセージ
    // --------------------------
    'validation_error' => '入力内容に誤りがあります。再度確認してください。',
    'category_not_found' => '指定されたカテゴリは存在しません。',
    'category_name_exists' => 'カテゴリ：:nameは既に登録されています。',
];
