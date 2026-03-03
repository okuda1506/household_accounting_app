<?php

namespace App\DTO;

use InvalidArgumentException;

/**
 * AIレスポンスの analysis セクションを表すDTO.
 *
 * AIから返却される生の配列データを、
 * 型安全かつ構造保証されたオブジェクトへ変換するためのクラス.
 */
class AnalysisDTO
{
    public function __construct(
        public int $budgetGap,
        public int $dailySafeLimit,
        public string $mainIssueCategory,
        public string $analysisReason,
    ){}

    public static function fromArray(array $data): self
    {
        self::validate($data);

        return new self(
            budgetGap: $data['budget_gap'],
            dailySafeLimit: $data['daily_safe_limit'],
            mainIssueCategory: $data['main_issue_category'],
            analysisReason: $data['analysis_reason']
        );
    }

    private static function validate(array $data): void
    {
        $required = [
            'budget_gap',
            'daily_safe_limit',
            'main_issue_category',
            'analysis_reason'
        ];

        foreach ($required as $key) {
            if (!array_key_exists($key, $data)) {
                throw new InvalidArgumentException("analysis.{$key} is missing in AI response");
            }

            if (!is_int($data['budget_gap'])) {
                throw new InvalidArgumentException('analysis.budget_gap must be int in AI response');
            }

            if (!is_int($data['daily_safe_limit'])) {
                throw new InvalidArgumentException('analysis.daily_safe_limit must be int in AI response');
            }

            if (!is_string($data['main_issue_category'])) {
                throw new InvalidArgumentException('analysis.main_issue_category must be string in AI response');
            }

            if (!is_string($data['analysis_reason'])) {
                throw new InvalidArgumentException('analysis.analysis_reason must be string in AI response');
            }
        }
    }

    public function toArray(): array
    {
        return [
            'budget_gap' => $this->budgetGap,
            'daily_safe_limit' => $this->dailySafeLimit,
            'main_issue_category' => $this->mainIssueCategory,
            'analysis_reason' => $this->analysisReason,
        ];
    }
}
