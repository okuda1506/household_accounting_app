<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AiAdviceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'risk_level' => $this->riskLevel->value(),
            'analysis' => [
                'budget_gap' => $this->analysis->budgetGap,
                'daily_safe_limit' => $this->analysis->dailySafeLimit,
                'main_issue_category' => $this->analysis->mainIssueCategory,
                'analysis_reason' => $this->analysis->analysisReason,
            ],
            'pattern' => $this->pattern,
            'advice' => [
                'micro_action' => $this->advice->microAction,
                'daily_budget_target' => $this->advice->dailyBudgetTarget,
                'focus_category' => $this->advice->focusCategory,
            ],
            'motivation' => $this->motivation,
        ];
    }
}
