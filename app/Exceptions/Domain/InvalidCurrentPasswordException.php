<?php

namespace App\Exceptions\Domain;

use DomainException;
use Symfony\Component\HttpFoundation\Response;

/**
 * 現在のパスワード不一致を表す業務例外
 *
 * パスワード変更時に current_password が一致しない場合にスロー
 * - messageKey(): エラーメッセージの言語キー
 * - status(): HTTPステータスコード
 */
class InvalidCurrentPasswordException extends DomainException
{
    public function messageKey(): string
    {
        return 'messages.current_password_invalid';
    }

    public function status(): int
    {
        return Response::HTTP_UNPROCESSABLE_ENTITY;
    }
}
