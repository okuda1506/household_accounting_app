<?php
namespace App\Services\Ai;

use App\DTO\AiAdviceResponseDTO;
use App\Ai\Agents\SalesCoach;
use App\Services\Ai\AiInputBuilder;
use App\Services\Ai\AiCoachingLogService;

/**
 * AIアドバイス関連のビジネスロジックを管理するサービスクラス
 */
class AiAdviceService
{
    private AiInputBuilder $aiInputBuilder;
    private AiCoachingLogService $aiCoachingLogService;

    public function __construct(
        AiCoachingLogService $aiCoachingLogService,
        AiInputBuilder $aiInputBuilder
    ){
        $this->aiInputBuilder = $aiInputBuilder;
        $this->aiCoachingLogService = $aiCoachingLogService;
    }

    /**
     * AIアドバイスを取得する
     *
     * @param int $userId ユーザーID
     *
     * @return
     */
    public function getAdvice(int $userId): AiAdviceResponseDTO
    {
        $inputData = $this->aiInputBuilder->build($userId);
        $prompt = json_encode($inputData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        // AI呼び出し
        $salesCoach = new SalesCoach();
        $response = $salesCoach->prompt($prompt);

        $decoded = json_decode($response->text, true);

        if (!$decoded) {
            throw new \RuntimeException('AIレスポンスがJSONではありません');
        }

        $dto = AiAdviceResponseDTO::fromArray($decoded);

        $this->aiCoachingLogService->save($userId, $dto, $inputData);

        return $dto;
    }
}
