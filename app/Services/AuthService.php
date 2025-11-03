<?php
namespace App\Services;

use App\Models\User;
use App\Notifications\ReactivateAccount;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 *  認証関連のビジネスロジックを管理するサービスクラス
 *
 * - registerUser(): ユーザーの新規登録
 * - loginUser(): ログイン処理
 * - logoutUser(): ログアウト処理
 */
class AuthService
{
    /**
     * ユーザーの新規登録
     *
     * @param Request $request
     * @return array{user: User, token: string}
     * @throws ValidationException
     */
    public function registerUser(Request $request): array
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'lowercase', 'email', 'max:255'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // 単一のDBクエリでユーザーの存在とdeletedステータスをチェック
        $existingUser = User::where('email', $validated['email'])->first();

        if ($existingUser) {
            if ($existingUser->deleted) {
                throw ValidationException::withMessages([
                    'email' => __('messages.user_already_deleted'),
                ]);
            } else {
                // ユーザーが存在し、かつ削除されていない場合（ユニーク制約違反）
                throw ValidationException::withMessages([
                    'email' => __('validation.unique', ['attribute' => $validated['email']]),
                ]);
            }
        }

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        event(new Registered($user));

        $token = $user->createToken('access_token')->plainTextToken;

        return [
            'user'  => $user,
            'token' => $token,
        ];
    }

    /**
     * ログイン
     *
     * @param Request $request
     * @return array{user: User, token: string}
     * @throws ValidationException
     */
    public function loginUser(Request $request): array
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => __('messages.signin_failed'),
            ]);
        }

        if ($user->deleted) {
            throw ValidationException::withMessages([
                'email' => __('messages.user_already_deleted'),
            ]);
        }

        $token = $user->createToken('access_token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    /**
     * ログアウト
     *
     * @param Request $request
     * @return void
     */
    public function logoutUser(Request $request): void
    {
        $request->user()->currentAccessToken()->delete();
    }

    /**
     * パスワードリセットリンクの送信
     *
     * @param Request $request
     * @return string
     * @throws ValidationException
     */
    public function sendPasswordResetLink(Request $request): array
    {
        $validated = $request->validate(['email' => ['required', 'email']]);

        $status = Password::sendResetLink($validated, function ($user, $token) {
            if ($user->deleted) {
                $user->notify(new ReactivateAccount($token));
            } else {
                $user->notify(new ResetPassword($token));
            }
        });

        return [
            'status' => $status,
        ];
    }

    /**
     * パスワードリセット
     *
     * @param Request $request
     * @return array
     * @throws ValidationException
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'deleted' => false, // アカウントを再有効化
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        return [
            'status' => $status,
        ];
    }

}
