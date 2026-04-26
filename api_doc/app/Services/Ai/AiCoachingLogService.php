<?php
namespace App\Services\Ai;

use App\Models\AiCoachingLog;
use App\DTO\AiAdviceResponseDTO;

class AiCoachingLogService
{
    public function save(int $userId, AiAdviceResponseDTO $dto, array $inputData): void
    {
        AiCoachingLog::create([
            'user_id'                 => $userId,
            'monthly_budget'          => $inputData['monthly_budget'],
            'current_total'           => $inputData['current_total'],
            'projected_monthly_total' => $inputData['projected_monthly_total'],
            'remaining_days'          => $inputData['remaining_days'],
            'risk_level'              => $dto->riskLevel->value(),
            'budget_gap'              => $dto->analysis->budgetGap,
            'daily_safe_limit'        => $dto->analysis->dailySafeLimit,
            'main_issue_category'     => $dto->analysis->mainIssueCategory,
            'analysis_reason'         => $dto->analysis->analysisReason,
            'pattern'                 => $dto->pattern,
            'micro_action'            => $dto->advice->microAction,
            'daily_budget_target'     => $dto->advice->dailyBudgetTarget,
            'focus_category'          => $dto->advice->focusCategory,
            'motivation'              => $dto->motivation,
        ]);
    }
}
