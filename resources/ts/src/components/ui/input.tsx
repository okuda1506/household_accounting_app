import * as React from "react";
import { X } from "lucide-react";

import { cn } from "../../../lib/utils";

type InputProps = React.ComponentProps<"input"> & {
    onClear?: () => void;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, onClear, type, ...props }, ref) => {
        const hasValue =
            props.value !== undefined &&
            props.value !== null &&
            String(props.value).length > 0;
        const canClear = Boolean(onClear) && !props.disabled && !props.readOnly;

        return (
            <div className="relative w-full">
                <input
                    type={type}
                    className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        canClear && "pr-11",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {canClear && hasValue && (
                    <button
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={onClear}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        aria-label="入力内容をクリア"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
