<?php

namespace App\DTO;

use InvalidArgumentException;

/**
 * AIレスポンスの advice セクションを表すDTO.
 *
 * AIから返却される生の配列データを、
 * 型安全かつ構造保証されたオブジェクトへ変換するためのクラス.
 */
class AdviceDTO
{
    public function __construct(
        public string $microAction,
        public int $dailyBudgetTarget,
        public string $focusCategory,
    ){}

    public static function fromArray(array $data): self
    {
        self::validate($data);

        return new self(
            microAction: $data['micro_action'],
            dailyBudgetTarget: $data['daily_budget_target'],
            focusCategory: $data['focus_category']
        );
    }

    private static function validate(array $data): void
    {
        $required = [
            'micro_action',
            'daily_budget_target',
            'focus_category'
        ];

        foreach ($required as $key) {
            if (!array_key_exists($key, $data)) {
                throw new InvalidArgumentException("advice.{$key} is missing in AI response");
            }
        }

        if (!is_string($data['micro_action'])) {
            throw new InvalidArgumentException('advice.micro_action must be string in AI response');
        }

        if (!is_int($data['daily_budget_target'])) {
            throw new InvalidArgumentException('advice.daily_budget_target must be int in AI response');
        }

        if (!is_string($data['focus_category'])) {
            throw new InvalidArgumentException('advice.focus_category must be string in AI response');
        }
    }

    public function toArray(): array
    {
        return [
            'micro_action' => $this->microAction,
            'daily_budget_target' => $this->dailyBudgetTarget,
            'focus_category' => $this->focusCategory,
        ];
    }
}
