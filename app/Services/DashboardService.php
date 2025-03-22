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
    private const PAST_MONTHS_COUNT = 5;

    private string $startOfMonth;
    private string $endOfMonth;

    public function __construct()
    {
        $now                = Carbon::now();
        $this->startOfMonth = $now->startOfMonth()->toDateString();
        $this->endOfMonth   = $now->endOfMonth()->toDateString();
    }

    /**
     * 収支情報を取得
     *
     * @param int $userId
     * @return array
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
            'income'  => $income,
            'expense' => $expense,
            'balance' => $income - $expense,
        ];
    }

    /**
     * 過去の月別支出推移を取得
     *
     * @param int $userId
     * @return array
     */
    public function getMonthlyExpenseTrend(int $userId): array
    {
        $now           = Carbon::now();
        $startOfPeriod = $now->subMonths(self::PAST_MONTHS_COUNT)->startOfMonth();

        // 月ごとの支出集計
        $expenses = DB::table('transactions')
            ->selectRaw('YEAR(transaction_date) as year, MONTH(transaction_date) as month, SUM(amount) as total_expense')
            ->where('user_id', $userId)
            ->where('transaction_type_id', self::TRANSACTION_TYPE_EXPENSE)
            ->where('transaction_date', '>=', $startOfPeriod->toDateString())
            ->groupByRaw('YEAR(transaction_date), MONTH(transaction_date)')
            ->orderByRaw('YEAR(transaction_date) DESC, MONTH(transaction_date) DESC')
            ->get();

        return $expenses->toArray();
    }

    /**
     * 最近の取引を取得
     *
     * @param int $userId
     * @return array
     */
    public function getRecentTransactions(int $userId): array
    {
        $transactions = DB::table('transactions')
            ->where('user_id', $userId)
            ->orderBy('transaction_date', 'desc')
            ->limit(self::RECENT_TRANSACTIONS_LIMIT)
            ->get();

        return $transactions->toArray();
    }
}
