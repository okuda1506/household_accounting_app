<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    // 収入
    const TRANSACTION_TYPE_INCOME = 1;

    // 支出
    const TRANSACTION_TYPE_EXPENSE = 2;

    // 削除フラグOFF
    const IS_NOT_DELETED = 0;

    // 最近の取引の取得件数
    private const RECENT_TRANSACTIONS_LIMIT = 5;

    // 過去何ヶ月分まで取得するかの定数
    private const PAST_MONTHS_COUNT = 6;

    private string $startOfMonth;

    private string $endOfMonth;

    public function __construct()
    {
        $now = Carbon::now();
        $this->startOfMonth = $now->startOfMonth()->toDateString();
        $this->endOfMonth = $now->endOfMonth()->toDateString();
    }

    /**
     * 収支情報を取得
     */
    public function getSummary(int $userId): array
    {
        // 今月の合計収入
        $income = DB::table('transactions')
            ->where('user_id', $userId)
            ->where('transaction_type_id', self::TRANSACTION_TYPE_INCOME)
            ->where('deleted', self::IS_NOT_DELETED)
            ->whereBetween('transaction_date', [$this->startOfMonth, $this->endOfMonth])
            ->sum('amount');

        // 今月の合計支出
        $expense = DB::table('transactions')
            ->where('user_id', $userId)
            ->where('transaction_type_id', self::TRANSACTION_TYPE_EXPENSE)
            ->where('deleted', self::IS_NOT_DELETED)
            ->whereBetween('transaction_date', [$this->startOfMonth, $this->endOfMonth])
            ->sum('amount');

        return [
            'income' => $income,
            'expense' => $expense,
            'balance' => $income - $expense,
        ];
    }

    /**
     * 過去の月別支出推移を取得
     */
    public function getMonthlyExpenseTrend(int $userId): array
    {
        $now = Carbon::now()->startOfMonth();
        $start = $now->copy()->subMonths(self::PAST_MONTHS_COUNT - 1);
        $months = collect();

        // 月一覧（Carbon）で生成
        for ($date = $start->copy(); $date->lte($now); $date->addMonth()) {
            $months->push([
                'year' => $date->year,
                'month' => $date->month,
            ]);
        }

        // DBから該当月の支出合計を取得
        $expenses = DB::table('transactions')
            ->selectRaw('EXTRACT(YEAR FROM transaction_date) as year, EXTRACT(MONTH FROM transaction_date) as month, SUM(amount) as total_expense')
            ->where('user_id', $userId)
            ->where('transaction_type_id', self::TRANSACTION_TYPE_EXPENSE)
            ->whereBetween('transaction_date', [$start->toDateString(), $now->copy()->endOfMonth()->toDateString()])
            ->where('deleted', self::IS_NOT_DELETED)
            ->groupByRaw('EXTRACT(YEAR FROM transaction_date), EXTRACT(MONTH FROM transaction_date)')
            ->get()
            ->keyBy(function ($item) {
                return (int) $item->year.'-'.str_pad((int) $item->month, 2, '0', STR_PAD_LEFT);
            });

        // 月一覧に DB 結果をマージ（なければ total_expense = 0）
        $result = $months->map(function ($month) use ($expenses) {
            $key = $month['year'].'-'.str_pad($month['month'], 2, '0', STR_PAD_LEFT);

            return [
                'year' => $month['year'],
                'month' => $month['month'],
                'total_expense' => isset($expenses[$key]) ? (float) $expenses[$key]->total_expense : 0,
            ];
        });

        return $result->toArray();
    }

    /**
     * 最近の取引を取得
     */
    public function getRecentTransactions(int $userId): array
    {
        $transactions = DB::table('transactions')
            ->leftJoin('categories', 'transactions.category_id', '=', 'categories.id')
            ->where('transactions.user_id', $userId)
            ->where('transactions.deleted', self::IS_NOT_DELETED)
            ->select('transactions.*', 'categories.name as category_name')
            ->orderBy('transactions.transaction_date', 'desc')
            ->orderBy('transactions.created_at', 'desc')
            ->limit(self::RECENT_TRANSACTIONS_LIMIT)
            ->get();

        return $transactions->toArray();
    }
}
