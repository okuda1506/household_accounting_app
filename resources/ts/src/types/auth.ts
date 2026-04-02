import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface AuthPasswordFormProps {
    pageTitle: string;
    pageDescription?: string;
    invalidLinkToastMessage: string;
    invalidLinkCardTitle: string;
    invalidLinkCardContent: string;
    invalidLinkRedirectPath: string;
    apiEndpoint: string;
    successToastMessage: string;
    failureToastMessage: string;
    successRedirectPath: string;
    submitButtonText: string;
}

export interface Highlight {
    description: string;
    icon: LucideIcon;
    title: string;
}

export interface AuthShellProps {
    brandName?: string;
    children: ReactNode;
    className?: string;
    description?: string;
    panelDescription?: string;
    panelTitle?: ReactNode;
    title?: string;
    variant?: "default" | "simple";
}

export interface RevealOnViewProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}
