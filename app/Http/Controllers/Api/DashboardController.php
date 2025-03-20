<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class DashboardController extends Controller
{
    private DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * ダッシュボード情報を取得
     *
     * @return JsonResponse
     */
    public function getDashboardData(): JsonResponse
    {
        try {
            $userId = auth()->id();

            // フロントに表示する各項目のデータを取得
            $summary      = $this->dashboardService->getSummary($userId);
            $trend        = $this->dashboardService->getMonthlyExpenseTrend($userId);
            $transactions = $this->dashboardService->getRecentTransactions($userId);

            return response()->json([
                'monthly_summary'     => $summary,
                'expense_trend'       => $trend,
                'recent_transactions' => $transactions,
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json([
                'message' => __('messages.dashboard_get_failed'),
                'error'   => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
