export interface User {
    id: number;
    name: string;
    email: string;
    budget: number | null;
    ai_advice_mode: boolean;
}
