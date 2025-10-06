<?php
namespace App\Services;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;

/**
 *  認証関連のビジネスロジックを管理するサービスクラス
 *
 * - registerUser(): ユーザーの新規登録
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
        /// 退会済みユーザーチェック
        $existingUser = User::where('email', $request->email)->first();
        if ($existingUser && $existingUser->deleted) {
            throw ValidationException::withMessages([
                'email' => __('messages.user_already_deleted'),
            ]);
        }

        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

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
}
