<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete()->comment('ユーザーID');
            $table->string('name', 30)->comment('カテゴリ名');
            $table->foreignId('transaction_type_id')->constrained('transaction_types')->cascadeOnDelete()->comment('取引タイプID');
            $table->integer('sort_no')->default(1)->comment('並び順');
            $table->boolean('deleted')->default(false)->comment('削除フラグ');
            $table->timestamps(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
