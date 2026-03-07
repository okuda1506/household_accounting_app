<?php
namespace App\Services\Ai;

use App\Models\AiCoachingLog;
use App\DTO\AiAdviceResponseDTO;

class AiCoachingLogService
{
    public function save(int $userId, AiAdviceResponseDTO $dto): void
    {
        AiCoachingLog::create([
            'user_id'                 => $userId,
            'monthly_budget'          => $dto->monthlyBudget ?? 0, // todo: AIレスポンスにmonthlyBudgetを追加して、そこから値を保存するようにする
            'current_total'           => $dto->currentTotal ?? 0, // todo: AIレスポンスにmonthlyBudgetを追加して、そこから値を保存するようにする
            'projected_monthly_total' => $dto->projectedMonthlyTotal ?? 0, // todo: AIレスポンスにmonthlyBudgetを追加して、そこから値を保存するようにする
            'remaining_days'          => $dto->remainingDays ?? 0, // todo: AIレスポンスにmonthlyBudgetを追加して、そこから値を保存するようにする
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
