<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\ReactivateAccount;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class PasswordResetLinkController extends Controller
{
    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'email']]);

        // ユーザーの状態を確認
        $user = User::where('email', $request->email)->first();

        // ユーザーが存在しない場合は通常のパスワードリセットと同じ挙動にする
        // そのためメールアドレスの存在を外部に推測させない
        $status = Password::sendResetLink($request->only('email'), function ($user) {
            // 通知をカスタマイズ
            $token = Password::createToken($user);
            if ($user->deleted) {
                // 退会済みの場合はアカウント再開用の通知を送る
                $user->notify(new ReactivateAccount($token));
            } else {
                // アクティブな場合は通常のパスワードリセット通知を送る
                $user->notify(new ResetPassword($token));
            }
        });

        return $status == Password::RESET_LINK_SENT
            ? response()->json(['status' => __($status)])
            : throw ValidationException::withMessages(['email' => [__($status)]]);
    }
}
