<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        Password::defaults(static fn () => Password::min(8)
            ->max(255) // 255文字以下であること
            ->mixedCase() // 大文字と小文字のアルファベットを含むこと
            ->numbers() // 数字を1文字以上含むこと
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
