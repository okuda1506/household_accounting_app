<?php

namespace App\DTO;

use App\ValueObjects\RiskLevel;
use InvalidArgumentException;

/**
 * AIアドバイスレスポンス全体を表すDTO.
 *
 * AIから返却されるレスポンスの構造を保証し、
 * ネストされた analysis, advice も含めて
 * 型安全なオブジェクトへ変換するためのクラス.
 */
class AiAdviceResponseDTO
{
    public function __construct(
        public RiskLevel $riskLevel,
        public AnalysisDTO $analysis,
        public string $pattern,
        public AdviceDTO $advice,
        public string $motivation,
    ){}

    public static function fromArray(array $data): self
    {
        self::validate($data);

        return new self (
            riskLevel: RiskLevel::from($data['risk_level']),
            analysis: AnalysisDTO::fromArray($data['analysis']),
            pattern: $data['pattern'],
            advice: AdviceDTO::fromArray($data['advice']),
            motivation: $data['motivation']
        );
    }

    private static function validate(array $data): void
    {
        $required = [
            'risk_level',
            'analysis',
            'pattern',
            'advice',
            'motivation'
        ];

        foreach ($required as $key) {
            if (!array_key_exists($key, $data)) {
                throw new InvalidArgumentException("{$key} is missing in AI response");
            }
        }

        if (!is_array($data['analysis'])) {
            throw new InvalidArgumentException('analysis must be array in AI response');
        }

        if (!is_string($data['pattern'])) {
            throw new InvalidArgumentException('pattern must be string in AI response');
        }

        if (!is_array($data['advice'])) {
            throw new InvalidArgumentException('advice must be array in AI response');
        }

        if (!is_string($data['motivation'])) {
            throw new InvalidArgumentException('motivation must be string in AI response');
        }
    }

    public function toArray(): array
    {
        return [
            'risk_level' => $this->riskLevel->value(),
            'analysis' => $this->analysis->toArray(),
            'pattern' => $this->pattern,
            'advice' => $this->advice->toArray(),
            'motivation' => $this->motivation
        ];
    }
}
