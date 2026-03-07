<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\AiAdviceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Resources\AiAdviceResource;
use Illuminate\Support\Facades\Log;

class AIAdviceController extends Controller
{
    private AiAdviceService $aiAdviceService;

    public function __construct(AiAdviceService $aiAdviceService)
    {
        $this->aiAdviceService = $aiAdviceService;
    }
    /**
     * AIアドバイスを取得する
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $dto = $this->aiAdviceService->getAdvice(auth()->id());
        } catch (\Throwable $e) {
            Log::error($e);

            return ApiResponse::error(
                null,
                [__('messages.ai_advice_fetch_failed') . ': ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }

        return ApiResponse::success(
            new AiAdviceResource($dto),
            __('messages.ai_advice_fetched')
        );
    }
}
