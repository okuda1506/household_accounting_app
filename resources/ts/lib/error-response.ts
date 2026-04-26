export type FieldErrors = Record<string, string[]>;

// バックエンドの validation errors 形式かどうかを判定する
const isFieldErrors = (value: unknown): value is FieldErrors => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return false;
    }

    return Object.values(value).every(
        (messages) =>
            Array.isArray(messages) &&
            messages.every((message) => typeof message === "string")
    );
};

// レスポンス内の errors または data から項目別エラーを取り出す
const getFieldErrorsFromResponse = (error: any): FieldErrors | null => {
    const candidates = [
        error?.response?.data?.errors,
        error?.response?.data?.data,
    ];

    for (const candidate of candidates) {
        if (isFieldErrors(candidate)) {
            return candidate;
        }
    }

    return null;
};

// API エラーレスポンスから画面上部等で使う汎用メッセージ配列を取り出す
export const extractErrorMessages = (
    error: any,
    fallbackMessage: string
): string[] => {
    const messages = error?.response?.data?.messages;

    if (
        Array.isArray(messages) &&
        messages.every((message) => typeof message === "string")
    ) {
        return messages;
    }

    const validationErrors = getFieldErrorsFromResponse(error);

    if (validationErrors) {
        return Object.values(validationErrors).flat();
    }

    const message = error?.response?.data?.message;

    if (typeof message === "string" && message.trim() !== "") {
        return [message];
    }

    return [fallbackMessage];
};

// API エラーレスポンスから項目別エラーを優先して取り出しなければ general にまとめる
export const extractFieldErrors = (
    error: any,
    fallbackMessage: string
): FieldErrors => {
    const validationErrors = getFieldErrorsFromResponse(error);

    if (error?.response?.status === 422 && validationErrors) {
        return validationErrors;
    }

    return { general: extractErrorMessages(error, fallbackMessage) };
};
