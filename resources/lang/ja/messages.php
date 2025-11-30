<?php

return [
    // --------------------------
    // 処理成功メッセージ
    // --------------------------
    'category_list_fetched'                       => 'カテゴリ一覧を取得しました。',
    'category_created'                            => 'カテゴリを登録しました。',
    'category_updated'                            => 'カテゴリを更新しました。',
    'category_deleted'                            => 'カテゴリを削除しました。',
    'category_sorted'                             => 'カテゴリの並び順を更新しました。',
    'payment_method_list_fetched'                 => '支払方法一覧を取得しました。',
    'transaction_list_fetched'                    => '取引一覧を取得しました。',
    'transaction_created'                         => '取引を登録しました。',
    'transaction_updated'                         => '取引を更新しました。',
    'transaction_deleted'                         => '取引を削除しました。',
    'user_signed_out'                             => 'サインアウトしました。',
    'user_registered'                             => 'ユーザー登録が完了しました。',
    'user_signed_in'                              => 'サインインしました。',
    'user_account_deleted'                        => 'アカウントを削除しました。',
    'user_send_password_reset_link'               => '案内メールを送信しました。',
    'user_password_reset'                         => 'パスワードを更新しました。',
    'user_account_reactivated'                    => 'アカウントを再開しました。',
    'user_name_updated'                           => 'ユーザー名を更新しました。',
    'user_email_change_code_sent'                 => '認証コードを送信しました。',
    'user_email_change_code_invalid'              => '認証コードが無効です。',
    'user_email_change_code_verified'             => '認証コードを確認しました。',
    'user_email_updated'                          => 'メールアドレスを更新しました。',

    // --------------------------
    // バリデーションメッセージ
    // --------------------------
    'user_id_required'                            => 'ユーザーIDは必須です。',
    'user_id_integer'                             => 'ユーザーIDは数値でなければなりません。',
    'user_email_invalid'                          => '無効なメールアドレスです。',
    'user_token_invalid'                          => '無効なトークンです。',
    'user_email_not_found'                        => 'メールアドレスが見つかりません。',
    'user_password_confirmed'                     => 'パスワードと確認用項目が一致しません。',
    'user_id_exists'                              => '無効なユーザーIDです。',
    'user_not_found'                              => 'ユーザーが見つかりません。',
    'name_required'                               => 'カテゴリ名は必須です。',
    'name_string'                                 => 'カテゴリ名は文字列でなければなりません。',
    'name_max_30'                                 => 'カテゴリ名は30字以内にしてください。',
    'transaction_type_id_required'                => '取引タイプIDは必須です。',
    'transaction_type_id_integer'                 => '取引タイプIDは数値でなければなりません。',
    'transaction_type_id_exists'                  => '無効な取引タイプIDです。',
    'sorted_category_ids_required'                => 'ソート順は必須です。',
    'sort_no_integer'                             => 'ソート順は数値でなければなりません。',
    'sorted_category_ids.required'                => 'カテゴリIDのリストは必須です。',
    'sorted_category_ids_array'                   => 'カテゴリIDのリストは配列で指定してください。',
    'sorted_category_ids_integer'                 => 'カテゴリIDは整数で指定してください。',
    'sorted_category_ids_exists'                  => '指定されたカテゴリIDが存在しません。',
    'transaction_date_required'                   => '取引日は必須です。',
    'transaction_date_date'                       => '取引日が無効です。',
    'category_id_required'                        => 'カテゴリは必須です。',
    'category_id_exists'                          => 'カテゴリを選択してください。',
    'amount_required'                             => '金額を入力してください。',
    'amount_numeric'                              => '金額は数値で入力してください。',
    'amount_min'                                  => '金額は0以上の値を入力してください。',
    'payment_method_id_required'                  => '支払方法は必須です。',
    'payment_method_id_exists'                    => '支払方法を選択してください。',
    'memo_string'                                 => 'メモは文字列で入力してください。',
    'memo_max'                                    => 'メモは255文字以内で入力してください。',

    // --------------------------
    // カスタムバリデーションメッセージ
    // --------------------------
    'invalid_category_for_transaction_type'       => '選択されたカテゴリは指定された取引タイプに対応していません。',
    'invalid_payment_method_for_transaction_type' => '選択された支払方法は指定された取引タイプに対応していません。',

    // --------------------------
    // エラーメッセージ
    // --------------------------
    'server_error'                                => 'サーバーでエラーが発生しました。',
    'unauthorized'                                => 'この操作を実行する権限がありません。',
    'validation_error'                            => '入力内容に誤りがあります。再度確認してください。',
    'category_not_found'                          => 'カテゴリを選択してください',
    'category_name_exists'                        => 'カテゴリ：:nameは既に登録されています。',
    'category_get_failed'                         => 'カテゴリの取得に失敗しました。',
    'category_store_failed'                       => 'カテゴリの登録に失敗しました。',
    'category_update_failed'                      => 'カテゴリの更新に失敗しました。',
    'category_destroy_failed'                     => 'カテゴリの削除に失敗しました。',
    'category_sort_failed'                        => 'カテゴリの並び順の更新に失敗しました。',
    'payment_method_get_failed'                   => '支払方法の取得に失敗しました。',
    'transaction_get_failed'                      => '取引データの取得に失敗しました。',
    'transaction_store_failed'                    => '取引の登録に失敗しました。',
    'transaction_update_failed'                   => '取引の更新に失敗しました。',
    'transaction_not_found'                       => '指定された取引データが見つかりません。',
    'transaction_destroy_failed'                  => '取引の削除に失敗しました。',
    'dashboard_get_failed'                        => 'ダッシュボード情報の取得に失敗しました。',
    'user_already_deleted'                        => 'このアカウントは既に退会済みです。ご利用の場合は再開手続きをしてください。',
    'signin_failed'                               => 'メールアドレスまたはパスワードが正しくありません。',
];
