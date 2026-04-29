<?php

namespace App\ValueObjects;

use InvalidArgumentException;

class RiskLevel
{
    private const SAFE = 'safe';

    private const WARNING = 'warning';

    private const DANGER = 'danger';

    private string $value;

    private function __construct(string $value)
    {
        $this->value = $value;
    }

    public static function from(string $value): self
    {
        $allowed = [
            self::SAFE,
            self::WARNING,
            self::DANGER,
        ];

        if (! in_array($value, $allowed, true)) {
            throw new InvalidArgumentException("Invalid risk level: {$value}");
        }

        return new self($value);
    }

    public function value(): string
    {
        return $this->value;
    }

    public function isSafe(): bool
    {
        return $this->value === self::SAFE;
    }

    public function isWarning(): bool
    {
        return $this->value === self::WARNING;
    }

    public function isDanger(): bool
    {
        return $this->value === self::DANGER;
    }
}
