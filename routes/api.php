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
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
    ->middleware('guest:sanctum')
    ->name('password.email');
Route::post('/reset-password', [NewPasswordController::class, 'store'])
    ->middleware('guest:sanctum')
    ->name('password.store');
Route::post('/reactivate-account', [ReactivateAccountController::class, 'store'])
    ->middleware('guest:sanctum')
    ->name('account.reactivate');

Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');

// access_token用
Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return response()->json($request->user());
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

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
