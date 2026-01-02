<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PaymentMethodController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\ReactivateAccountController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
    ->middleware('guest:sanctum')
    ->name('api.password.email');
Route::post('/reset-password', [NewPasswordController::class, 'store'])
    ->middleware('guest:sanctum')
    ->name('api.password.store');
Route::post('/reactivate-account', [ReactivateAccountController::class, 'store'])
    ->middleware('guest:sanctum')
    ->name('api.account.reactivate');

Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');

// ユーザー情報関連(設定画面のAPI)
Route::middleware('auth:sanctum')->prefix('user')->name('api.user.')->group(function () {
    // ユーザー情報取得
    Route::get('', [UserController::class, 'show'])->name('show');
    // ユーザー名変更
    Route::put('name', [UserController::class, 'updateName'])->name('update_name');
    // パスワード変更（ログイン中）
    // Route::put('password', [UserPasswordController::class, 'update']);
    // メールアドレス変更
    Route::prefix('email')->name('email.')->group(function () {
        Route::post('request', [UserController::class, 'requestEmailChange'])->name('request');
        Route::post('verify', [UserController::class, 'verifyEmailChangeCode'])->name('verify');
        Route::put('update', [UserController::class, 'updateEmail'])->name('update');
    });
});

Route::prefix('categories')
    ->middleware('auth:sanctum')
    ->controller(CategoryController::class)
    ->name('api.category.')
    ->group(function () {
        // カテゴリ取得
        Route::get('', 'index')->name('index');
        // カテゴリ追加
        Route::post('', 'store')->name('store');
        // カテゴリ更新
        Route::put('{id}', 'update')->name('update');
        // カテゴリ削除
        Route::delete('{id}', 'destroy')->name('destroy');
        // カテゴリソート
        Route::post('sort', 'sort')->name('sort');
    });

Route::prefix('transactions')
    ->middleware('auth:sanctum')
    ->controller(TransactionController::class)
    ->name('api.transaction.')
    ->group(function () {
        // 取引取得
        Route::get('', 'index')->name('index');
        // 取引追加
        Route::post('', 'store')->name('store');
        // 取引更新
        Route::put('{id}', 'update')->name('update');
        // 取引削除
        Route::delete('{id}', 'destroy')->name('destroy');
    });

Route::prefix('payment-methods')
    ->middleware('auth:sanctum')
    ->controller(PaymentMethodController::class)
    ->name('api.payment_method.')
    ->group(function () {
        // 支払方法取得
        Route::get('', 'index')->name('index');
    });

Route::prefix('dashboard')
    ->middleware('auth:sanctum')
    ->controller(DashboardController::class)
    ->name('api.dashboard.')
    ->group(function () {
        // ダッシュボード情報
        Route::get('', 'getDashboardData')->name('getDashboardData');
    });

// アカウント削除
Route::delete('/delete-user', [ProfileController::class, 'destroyApi'])
    ->middleware('auth:sanctum')
    ->name('api.profile.destroy');
