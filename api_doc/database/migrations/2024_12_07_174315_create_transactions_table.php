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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete()->comment('ユーザーID');
            $table->dateTime('transaction_date')->comment('取引日');
            $table->foreignId('transaction_type_id')->constrained('transaction_types')->cascadeOnDelete()->comment('取引タイプID');
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete()->comment('カテゴリID');
            $table->decimal('amount', 10, 2)->unsigned()->comment('金額');
            $table->foreignId('payment_method_id')->constrained('payment_methods')->cascadeOnDelete()->comment('支払方法ID');
            $table->string('memo', 255)->nullable()->comment('メモ');
            $table->boolean('deleted')->default(false)->comment('削除フラグ');
            $table->timestamps(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('transactions', function (Blueprint $table) {
            // 外部キー制約を削除
            $table->dropForeign(['transaction_type_id']);
        });

        // テーブルを削除
        Schema::dropIfExists('transactions');
    }
};
