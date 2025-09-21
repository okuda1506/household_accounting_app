<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PaymentMethodController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', function (Request $request) {
    $credentials = $request->only('email', 'password');

    if (! Auth::attempt($credentials)) {
        return response()->json(['message' => __('messages.login_failed')], 401);
    }

    $user  = Auth::user();
    $token = $user->createToken('access_token')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user'  => $user,
    ]);
});

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

Route::prefix('logout')
    ->middleware('auth:sanctum')
    ->group(function () {
        Route::post('', function (Request $request) {
            $request->user()->currentAccessToken()->delete();

            return response()->json(['message' => __('messages.logged_out')]);
        })->name('api.logout');
    });
