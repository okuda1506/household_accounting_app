import type { LucideIcon } from "lucide-react";

export type NavigationItem = {
    to: string;
    label: string;
    description: string;
    icon: LucideIcon;
    isActive: (pathname: string) => boolean;
};

export type DesktopMenuPosition = {
    x: number;
    y: number;
};

export type DragState = {
    pointerId: number;
    offsetX: number;
    offsetY: number;
};
