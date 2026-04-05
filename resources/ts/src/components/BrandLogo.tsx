import { useId } from "react";

import { cn } from "../../lib/utils";

interface BrandLogoProps {
    className?: string;
    iconClassName?: string;
    labelClassName?: string;
    name?: string;
    showWordmark?: boolean;
    tone?: "default" | "light";
}

function splitBrandName(name: string) {
    const match = name.match(/^(.*?)(\s*Flow)$/);

    if (!match) {
        return {
            prefix: name,
            suffix: "",
        };
    }

    return {
        prefix: match[1],
        suffix: match[2],
    };
}

export function BrandLogo({
    className,
    iconClassName,
    labelClassName,
    name = "KakeiFlow",
    showWordmark = true,
    tone = "default",
}: BrandLogoProps) {
    const badgeGradientId = useId().replace(/:/g, "");
    const accentGradientId = useId().replace(/:/g, "");
    const { prefix, suffix } = splitBrandName(name);
    const isLightTone = tone === "light";

    return (
        <span className={cn("inline-flex items-center", className)}>
            <svg
                viewBox="0 0 72 72"
                className={cn("h-10 w-10 shrink-0", iconClassName)}
                role="img"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient
                        id={badgeGradientId}
                        x1="16"
                        y1="14"
                        x2="56"
                        y2="58"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0%" stopColor="#0f172a" />
                        <stop offset="100%" stopColor="#312e81" />
                    </linearGradient>
                    <linearGradient
                        id={accentGradientId}
                        x1="32"
                        y1="36"
                        x2="50"
                        y2="53"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0%" stopColor="#93c5fd" />
                        <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                </defs>

                <rect
                    x="10"
                    y="10"
                    width="52"
                    height="52"
                    rx="16"
                    fill={`url(#${badgeGradientId})`}
                />

                <path
                    d="M26 20V52"
                    fill="none"
                    stroke="rgba(255,255,255,0.98)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M33 36C39 31 44 26 48 20"
                    fill="none"
                    stroke="rgba(255,255,255,0.98)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M33 36C39 39 44 44 49 52"
                    fill="none"
                    stroke={`url(#${accentGradientId})`}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            {showWordmark && (
                <span
                    className={cn(
                        "text-lg font-semibold tracking-[-0.03em]",
                        isLightTone ? "text-white" : "text-foreground",
                        labelClassName,
                    )}
                >
                    {suffix ? (
                        <>
                            <span>{prefix}</span>
                            <span
                                className={
                                    isLightTone ? "text-sky-100" : "text-sky-500"
                                }
                            >
                                {suffix}
                            </span>
                        </>
                    ) : (
                        name
                    )}
                </span>
            )}
        </span>
    );
}
