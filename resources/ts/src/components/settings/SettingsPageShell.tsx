import { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";

import { cn } from "../../../lib/utils";
import { AppHeader } from "../AppHeader";
import { Card, CardContent } from "../ui/card";

type SettingsPageShellProps = {
    children: ReactNode;
    description?: string;
    icon: LucideIcon;
    maxWidthClassName?: string;
    title: string;
};

export const settingsInputClassName =
    "h-12 rounded-xl border-border/70 bg-background/80 pl-11 shadow-sm transition focus-visible:border-primary/40 focus-visible:ring-[3px] focus-visible:ring-primary/20 focus-visible:ring-offset-0 dark:bg-background/60";

export const settingsInfoCardClassName =
    "rounded-2xl border border-border/70 bg-muted/40 p-4";

export const SettingsPageShell = ({
    children,
    description,
    icon: Icon,
    maxWidthClassName,
    title,
}: SettingsPageShellProps) => {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <AppHeader title="設定" />

            <main className="mx-auto max-w-5xl py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0">
                    <Card
                        className={cn(
                            "mx-auto rounded-[32px] border-border/70 bg-background/55 shadow-[0_32px_80px_-36px_rgba(15,23,42,0.45)] backdrop-blur-sm",
                            maxWidthClassName ?? "max-w-2xl"
                        )}
                    >
                        <CardContent className="p-6 sm:p-8">
                            <div className="mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center text-primary">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                            {title}
                                        </h1>
                                        {description && (
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {children}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};
