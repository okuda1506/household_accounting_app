<?php

namespace App\Services\Ai;

use App\Models\User;
use App\Models\Transaction;
use App\Models\TransactionType;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class AiInputBuilder
{
    /**
     * AIへのリクエストデータを生成する
     */
    public function build(int $userId): array
    {
        $user = User::query()->findOrFail($userId);
        $transactions = $this->getCurrentMonthTransactions($userId);
        $currentTotal = $this->calculateCurrentTotal($transactions);
        $remainingDays = $this->calculateRemainingDays();
        $projectedMonthlyTotal = $this->calculateProjectedMonthlyTotal($currentTotal);
        $categorySummary = $this->buildCategorySummary($transactions);

        return [
            'monthly_budget' => $user->budget,
            'current_total' => $currentTotal,
            'remaining_days' => $remainingDays,
            'projected_monthly_total' => $projectedMonthlyTotal,
            'category_summary' => $categorySummary,
        ];
    }

    /**
     * 当月の取引データ取得する
     */
    private function getCurrentMonthTransactions(int $userId): Collection
    {
        $startOfMonth = Carbon::now()->startOfMonth()->toDateString();
        $today = Carbon::now()->toDateString();

        return Transaction::query()
            ->where('user_id', $userId)
            ->where('transaction_type_id', TransactionType::EXPENSE)
            ->whereDate('transaction_date', '>=', $startOfMonth)
            ->whereDate('transaction_date', '<=', $today)
            ->with('category')
            ->get()
        ;
    }

    /**
     * 当月累計支出
     */
    private function calculateCurrentTotal(Collection $transactions): int
    {
        return (int) $transactions->sum('amount');
    }

    /**
     * 残日数(今日を含めない)
     */
    private function calculateRemainingDays(): int
    {
        $today = Carbon::now();
        $endOfMonth = Carbon::now()->endOfMonth();

        return max(0, $today->diffInDays($endOfMonth));
    }

    /**
     * 月末予測支出
     */
    private function calculateProjectedMonthlyTotal(int $currentTotal): int
    {
        $today = Carbon::now();

        $elapsedDays = max(1, $today->day); // 今日が何日か
        $daysInMonth = $today->daysInMonth; // 当月の日数

        // 1日あたりの平均支出 × 当月日数 から月末予測額を算出した値を返す
        return (int) round(($currentTotal / $elapsedDays) * $daysInMonth);
    }

    /**
     * カテゴリ別集計
     */
    private function buildCategorySummary(Collection $transactions): array
    {
        return $transactions
            ->groupBy(fn ($transaction) => $transaction->category?->name ?? '未分類')
            ->map(function ($group, $categoryName) {
                return [
                    'category' => $categoryName,
                    'total' => (int) $group->sum('amount'),
                    'count' => $group->count(),
                ];
            })
            ->values()
            ->all();
    }
}
