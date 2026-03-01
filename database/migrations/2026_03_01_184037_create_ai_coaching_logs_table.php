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
        Schema::create('ai_coaching_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete()->comment('ユーザーID');
            $table->integer('monthly_budget')->comment('月間予算');
            $table->integer('current_total')->comment('当月累計支出');
            $table->integer('projected_monthly_total')->comment('月末予測支出');
            $table->integer('remaining_days')->comment('残日数');
            $table->enum('risk_level', ['safe', 'warning', 'danger'])->comment('危険度');
            $table->integer('budget_gap')->comment('予算差分');
            $table->integer('daily_safe_limit')->comment('安全圏1日上限');
            $table->string('main_issue_category', 100)->comment('主問題カテゴリ');
            $table->text('analysis_reason')->comment('分析理由');
            $table->string('pattern', 100)->comment('行動パターン');
            $table->text('micro_action')->comment('今日の行動提案');
            $table->integer('daily_budget_target')->comment('推奨1日支出目標');
            $table->string('focus_category', 100)->comment('改善対象カテゴリ');
            $table->text('motivation')->comment('モチベーションメッセージ');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_coaching_logs');
    }
};
