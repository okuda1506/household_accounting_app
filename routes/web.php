<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    return view('index'); // React アプリを読み込む index.blade.php を返す
})->where('any', '.*');

// todo: おそらく以下の設定に戻せばログインしていなくてもホーム画面に遷移出来てしまう問題は解決できそう（※そのままだとログイン画面表示でエラーになるかもなので注意）
// Route::get('/', function () {
//     return view('index');
// })->middleware(['auth', 'verified'])->name('index');

// // ログイン・ログアウト用に一旦残しておく
// Route::get('/dashboard', function () {
//     return view('dashboard');
// })->name('dashboard');

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

// require __DIR__.'/auth.php';
