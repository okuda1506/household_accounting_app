<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    return view('index'); // React アプリを読み込む index.blade.php を返す
})->where('any', '.*');
