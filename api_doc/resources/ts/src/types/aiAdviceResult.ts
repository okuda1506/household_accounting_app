export interface AiAdviceApiResponse {
    success: boolean;
    message: string;
    data: AiAdviceResult;
}

export interface AiAdviceAnalysis {
    budget_gap: number;
    daily_safe_limit: number;
    main_issue_category: string;
    analysis_reason: string;
}

export interface AiAdviceAction {
    micro_action: string;
    daily_budget_target: number;
    focus_category: string;
}

export interface AiAdviceResult {
    risk_level: "safe" | "warning" | "danger";
    analysis: AiAdviceAnalysis;
    pattern: string;
    advice: AiAdviceAction;
    motivation: string;
}
