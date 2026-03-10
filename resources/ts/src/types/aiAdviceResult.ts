export interface AiAdviceApiResponse {
    success: boolean;
    message: string;
    data: AiAdviceResult;
}

export interface AiAdviceResult {
    risk_level: "safe" | "warning" | "danger";
    analysis: {
        budget_gap: number;
        daily_safe_limit: number;
        main_issue_category: string;
        analysis_reason: string;
    };
    pattern: string;
    advice: {
        micro_action: string;
        daily_budget_target: number;
        focus_category: string;
    };
    motivation: string;
}
