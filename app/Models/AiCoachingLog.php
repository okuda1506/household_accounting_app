<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiCoachingLog extends Model
{
    /**
     * 一括代入を許可する属性を指定する
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'monthly_budget',
        'current_total',
        'projected_monthly_total',
        'remaining_days',
        'risk_level',
        'budget_gap',
        'daily_safe_limit',
        'main_issue_category',
        'analysis_reason',
        'pattern',
        'micro_action',
        'daily_budget_target',
        'focus_category',
        'motivation',
    ];

    /**
     * ユーザーとのリレーション
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
