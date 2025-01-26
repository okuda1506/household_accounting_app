<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TransactionController;
use Illuminate\Database\Events\TransactionCommitted;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Route::middleware('auth:sanctum')->group(function () {
Route::prefix('categories')
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
    });

Route::prefix('transactions')
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
