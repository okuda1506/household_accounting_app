<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Ai\Agents\SalesCoach;

class AIAdviceController extends Controller
{
    public function aiAdvice(Request $request): JsonResponse
    {
        $user = $request->user();

        // todo: 分析用データ集計
        // todo: AI呼び出し
        $salesCoach = new SalesCoach();
        $response = $salesCoach->prompt('newjeansでおすすめの曲は？');
        dump($response);exit;

        return response()->json([
            'analysis' => $analysisText
        ]);
    }
}
