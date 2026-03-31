import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "../../../lib/utils";
import { Input } from "./input";

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type">;

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, ...props }, ref) => {
        const [visible, setVisible] = React.useState(false);

        return (
            <div className="relative">
                <Input
                    ref={ref}
                    type={visible ? "text" : "password"}
                    className={cn("pr-11", className)}
                    {...props}
                />
                <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => setVisible((current) => !current)}
                    aria-label={
                        visible
                            ? "パスワードを非表示にする"
                            : "パスワードを表示する"
                    }
                >
                    {visible ? (
                        <EyeOff className="h-4 w-4" />
                    ) : (
                        <Eye className="h-4 w-4" />
                    )}
                </button>
            </div>
        );
    },
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
