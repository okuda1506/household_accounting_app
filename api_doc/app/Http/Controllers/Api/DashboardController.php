<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    private DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * ダッシュボード情報を取得
     */
    public function getDashboardData(): JsonResponse
    {
        try {
            $user = auth()->user()->only(['id', 'name', 'email', 'ai_advice_mode', 'budget']);

            // フロントに表示する各項目のデータを取得
            $summary = $this->dashboardService->getSummary($user['id']);
            $trend = $this->dashboardService->getMonthlyExpenseTrend($user['id']);
            $transactions = $this->dashboardService->getRecentTransactions($user['id']);

            return response()->json([
                'user' => $user,
                'monthly_summary' => $summary,
                'expense_trend' => $trend,
                'recent_transactions' => $transactions,
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            Log::error($e);

            return ApiResponse::error(null, [__('messages.dashboard_get_failed')], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
