<?php

namespace App\Services\Ai;

use App\Ai\Agents\SalesCoach;
use App\DTO\AiAdviceResponseDTO;

/**
 * AIアドバイス関連のビジネスロジックを管理するサービスクラス
 */
class AiAdviceService
{
    private AiInputBuilder $aiInputBuilder;

    private AiCoachingLogService $aiCoachingLogService;

    private SalesCoach $salesCoach;

    public function __construct(
        AiCoachingLogService $aiCoachingLogService,
        AiInputBuilder $aiInputBuilder,
        SalesCoach $salesCoach
    ) {
        $this->aiInputBuilder = $aiInputBuilder;
        $this->aiCoachingLogService = $aiCoachingLogService;
        $this->salesCoach = $salesCoach;
    }

    /**
     * AIアドバイスを取得する
     *
     * @param  int  $userId  ユーザーID
     */
    public function getAdvice(int $userId): AiAdviceResponseDTO
    {
        $inputData = $this->aiInputBuilder->build($userId);
        $prompt = json_encode($inputData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        // AI呼び出し
        $response = $this->salesCoach->prompt($prompt);

        $decoded = json_decode($response->text, true);

        if (! $decoded) {
            throw new \RuntimeException('AIレスポンスがJSONではありません');
        }

        $dto = AiAdviceResponseDTO::fromArray($decoded);

        $this->aiCoachingLogService->save($userId, $dto, $inputData);

        return $dto;
    }
}
