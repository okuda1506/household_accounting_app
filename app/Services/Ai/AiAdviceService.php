<?php
namespace App\Services\Ai;

use App\DTO\AiAdviceResponseDTO;
use App\Ai\Agents\SalesCoach;
use App\Services\Ai\AiCoachingLogService;

/**
 * AIアドバイス関連のビジネスロジックを管理するサービスクラス
 */
class AiAdviceService
{
    private AiCoachingLogService $aiCoachingLogService;

    public function __construct(AiCoachingLogService $aiCoachingLogService)
    {
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
        // todo: $userIdをもとにユーザーの取引データや予算などを取得してAIへの入力データを構築する
        $input = 'テスト';

        // AI呼び出し
        $salesCoach = new SalesCoach();
        $response = $salesCoach->prompt($input);


        $decoded = json_decode($response->text, true);

        if (!$decoded) {
            throw new \RuntimeException('AIレスポンスがJSONではありません');
        }

        $dto = AiAdviceResponseDTO::fromArray($decoded);

        $this->aiCoachingLogService->save($userId, $dto);

        return $dto;
    }

    private function buildAiInput(int $userId): array
    {

    }
}
