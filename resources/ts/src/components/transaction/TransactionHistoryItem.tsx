import { cn } from "../../../lib/utils";

type TransactionHistoryItemProps = {
    amount: number;
    categoryName?: string | null;
    dateLabel: string;
    memo?: string | null;
    onClick?: () => void;
    transactionTypeId: number;
};

const TransactionHistoryItemContent = ({
    amount,
    categoryName,
    dateLabel,
    memo,
    transactionTypeId,
}: Omit<TransactionHistoryItemProps, "onClick">) => {
    const isIncome = transactionTypeId === 1;
    const primaryText = memo?.trim() || "メモなし";
    const secondaryText = categoryName?.trim() || null;

    return (
        <>
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <span
                        className={cn(
                            "inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium",
                            isIncome
                                ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                                : "bg-rose-500/10 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
                        )}
                    >
                        {isIncome ? "収入" : "支出"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {dateLabel}
                    </span>
                </div>
                <p className="mt-3 truncate text-sm font-medium text-foreground sm:text-[15px]">
                    {primaryText}
                </p>
                {secondaryText && (
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                        {secondaryText}
                    </p>
                )}
            </div>
            <div className="shrink-0 text-right">
                <p
                    className={cn(
                        "text-base font-semibold",
                        isIncome
                            ? "text-emerald-600 dark:text-emerald-300"
                            : "text-rose-600 dark:text-rose-300"
                    )}
                >
                    {isIncome ? "+" : "-"}¥{Math.abs(amount).toLocaleString()}
                </p>
            </div>
        </>
    );
};

export function TransactionHistoryItem({
    onClick,
    ...props
}: TransactionHistoryItemProps) {
    if (onClick) {
        return (
            <button
                type="button"
                className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-background/75 sm:px-5"
                onClick={onClick}
            >
                <TransactionHistoryItemContent {...props} />
            </button>
        );
    }

    return (
        <div className="flex items-start justify-between gap-4 px-4 py-4 sm:px-5">
            <TransactionHistoryItemContent {...props} />
        </div>
    );
}
