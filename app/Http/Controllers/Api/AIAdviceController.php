<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\Ai\AiGuardService;
use App\Services\Ai\AiAdviceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use App\Http\Resources\AiAdviceResource;
use Illuminate\Support\Facades\Log;

class AIAdviceController extends Controller
{
    private AiGuardService $aiGuardService;

    private AiAdviceService $aiAdviceService;

    public function __construct(
        AiGuardService $aiGuardService,
        AiAdviceService $aiAdviceService
    ){
        $this->aiGuardService = $aiGuardService;
        $this->aiAdviceService = $aiAdviceService;
    }

    /**
     * AIアドバイスを取得する
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $user = auth()->user();

            $this->aiGuardService->assertAiAdviceAvailable($user);

            $dto = $this->aiAdviceService->getAdvice($user->id);
        } catch (\Throwable $e) {
            Log::error($e);

            $statusCode = $e->getCode();

            return ApiResponse::error(
                null,
                [$e->getMessage()],
                is_int($statusCode) && $statusCode >= 400
                    ? $statusCode
                    : Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }

        return ApiResponse::success(
            new AiAdviceResource($dto),
            __('messages.ai_advice_fetched')
        );
    }
}
