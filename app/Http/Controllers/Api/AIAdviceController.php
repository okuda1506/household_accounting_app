<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AIAdviceController extends Controller
{
    public function aiAdvice(Request $request): JsonResponse
    {
        $user = $request->user();

        // 分析用データ集計
        // AI呼び出し

        $analysisText = "AIからのアドバイス例: 収支のバランスを見直して、無駄な支出を減らすことを検討してみてください。";

        return response()->json([
            'analysis' => $analysisText
        ]);
    }
}
