"use client";

import {
    type PointerEvent as ReactPointerEvent,
    useEffect,
    useId,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Bars3Icon as MenuIcon } from "@heroicons/react/24/outline";
import {
    ChevronRight,
    LayoutDashboard,
    ReceiptText,
    Settings2,
    Tags,
    X,
    type LucideIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

type NavigationItem = {
    to: string;
    label: string;
    description: string;
    icon: LucideIcon;
    isActive: (pathname: string) => boolean;
};

type DesktopMenuPosition = {
    x: number;
    y: number;
};

type DragState = {
    pointerId: number;
    offsetX: number;
    offsetY: number;
};

const navigationItems: NavigationItem[] = [
    {
        to: "/",
        label: "ダッシュボード",
        description: "収支概要と今月の流れを確認",
        icon: LayoutDashboard,
        isActive: (pathname) => pathname === "/",
    },
    {
        to: "/categories",
        label: "カテゴリ",
        description: "費目の追加と整理をまとめて管理",
        icon: Tags,
        isActive: (pathname) => pathname.startsWith("/categories"),
    },
    {
        to: "/transactions",
        label: "取引",
        description: "入出金の一覧と記録をすばやく操作",
        icon: ReceiptText,
        isActive: (pathname) => pathname.startsWith("/transactions"),
    },
    {
        to: "/settings",
        label: "設定",
        description: "アカウントとアプリの設定",
        icon: Settings2,
        isActive: (pathname) => pathname.startsWith("/settings"),
    },
];

const DESKTOP_MENU_STORAGE_KEY = "navigation-menu-desktop-position";
const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";
const DESKTOP_MENU_WIDTH = 352;
const DESKTOP_MENU_FALLBACK_HEIGHT = 420;
const VIEWPORT_PADDING = 16;
const DESKTOP_MENU_TOP_OFFSET = 88;
const NAVIGATION_MENU_ANCHOR_ID = "navigation-menu-anchor";

function clampDesktopPosition(
    position: DesktopMenuPosition,
    panel: HTMLDivElement | null,
): DesktopMenuPosition {
    if (typeof window === "undefined") {
        return position;
    }

    const panelWidth = panel?.offsetWidth ?? DESKTOP_MENU_WIDTH;
    const panelHeight = panel?.offsetHeight ?? DESKTOP_MENU_FALLBACK_HEIGHT;

    return {
        x: Math.min(
            Math.max(position.x, VIEWPORT_PADDING),
            Math.max(
                VIEWPORT_PADDING,
                window.innerWidth - panelWidth - VIEWPORT_PADDING,
            ),
        ),
        y: Math.min(
            Math.max(position.y, VIEWPORT_PADDING),
            Math.max(
                VIEWPORT_PADDING,
                window.innerHeight - panelHeight - VIEWPORT_PADDING,
            ),
        ),
    };
}

function getDefaultDesktopPosition(): DesktopMenuPosition {
    if (typeof window === "undefined") {
        return { x: VIEWPORT_PADDING, y: DESKTOP_MENU_TOP_OFFSET };
    }

    return clampDesktopPosition(
        {
            x: window.innerWidth - DESKTOP_MENU_WIDTH - 24,
            y: DESKTOP_MENU_TOP_OFFSET,
        },
        null,
    );
}

export function NavigationMenuAnchor() {
    return <div id={NAVIGATION_MENU_ANCHOR_ID} className="absolute right-0" />;
}

export function NavigationModal() {
    const [open, setOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [desktopPosition, setDesktopPosition] =
        useState<DesktopMenuPosition | null>(null);
    const [hasLoadedDesktopPosition, setHasLoadedDesktopPosition] =
        useState(false);
    const [triggerAnchor, setTriggerAnchor] = useState<HTMLElement | null>(
        null,
    );
    const location = useLocation();
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const desktopPanelRef = useRef<HTMLDivElement | null>(null);
    const dragStateRef = useRef<DragState | null>(null);
    const previousDesktopModeRef = useRef<boolean | null>(null);
    const titleId = useId();
    const descriptionId = useId();

    const closeModal = () => {
        setOpen(false);
    };

    useEffect(() => {
        setIsMounted(true);

        if (typeof window === "undefined") {
            return;
        }

        const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
        const updateDesktopMode = () => {
            setIsDesktop(mediaQuery.matches);
        };

        updateDesktopMode();
        mediaQuery.addEventListener("change", updateDesktopMode);

        return () => {
            mediaQuery.removeEventListener("change", updateDesktopMode);
        };
    }, []);

    useEffect(() => {
        if (previousDesktopModeRef.current !== null) {
            if (previousDesktopModeRef.current !== isDesktop) {
                setOpen(false);
            }
        }

        previousDesktopModeRef.current = isDesktop;
    }, [isDesktop]);

    useEffect(() => {
        if (!isMounted) {
            return;
        }

        const syncAnchor = () => {
            const nextAnchor = document.getElementById(
                NAVIGATION_MENU_ANCHOR_ID,
            );

            setTriggerAnchor((currentAnchor) =>
                currentAnchor === nextAnchor ? currentAnchor : nextAnchor,
            );

            if (!nextAnchor) {
                setOpen(false);
            }
        };

        syncAnchor();

        const observer = new MutationObserver(() => {
            syncAnchor();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        return () => {
            observer.disconnect();
        };
    }, [isMounted]);

    useEffect(() => {
        if (!isMounted) {
            return;
        }

        if (!isDesktop) {
            setHasLoadedDesktopPosition(false);
            return;
        }

        const savedPosition = window.localStorage.getItem(
            DESKTOP_MENU_STORAGE_KEY,
        );

        if (!savedPosition) {
            setDesktopPosition(getDefaultDesktopPosition());
            setHasLoadedDesktopPosition(true);
            return;
        }

        try {
            const parsedPosition = JSON.parse(
                savedPosition,
            ) as Partial<DesktopMenuPosition>;

            if (
                typeof parsedPosition.x === "number" &&
                typeof parsedPosition.y === "number"
            ) {
                setDesktopPosition(
                    clampDesktopPosition(
                        {
                            x: parsedPosition.x,
                            y: parsedPosition.y,
                        },
                        desktopPanelRef.current,
                    ),
                );
            } else {
                setDesktopPosition(getDefaultDesktopPosition());
            }
        } catch {
            setDesktopPosition(getDefaultDesktopPosition());
        }

        setHasLoadedDesktopPosition(true);
    }, [isDesktop, isMounted]);

    useEffect(() => {
        if (
            !isMounted ||
            !isDesktop ||
            !hasLoadedDesktopPosition ||
            !desktopPosition
        ) {
            return;
        }

        window.localStorage.setItem(
            DESKTOP_MENU_STORAGE_KEY,
            JSON.stringify(desktopPosition),
        );
    }, [desktopPosition, hasLoadedDesktopPosition, isDesktop, isMounted]);

    useEffect(() => {
        if (!isDesktop || !hasLoadedDesktopPosition) {
            return;
        }

        const handleResize = () => {
            setDesktopPosition((currentPosition) =>
                currentPosition
                    ? clampDesktopPosition(
                        currentPosition,
                        desktopPanelRef.current,
                    )
                    : getDefaultDesktopPosition(),
            );
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [hasLoadedDesktopPosition, isDesktop]);

    useEffect(() => {
        if (!isDesktop || !open) {
            return;
        }

        setDesktopPosition((currentPosition) => {
            if (!currentPosition) {
                return currentPosition;
            }

            const clampedPosition = clampDesktopPosition(
                currentPosition,
                desktopPanelRef.current,
            );

            if (
                clampedPosition.x === currentPosition.x &&
                clampedPosition.y === currentPosition.y
            ) {
                return currentPosition;
            }

            return clampedPosition;
        });

        requestAnimationFrame(() => {
            desktopPanelRef.current?.focus();
        });
    }, [isDesktop, open]);

    useEffect(() => {
        return () => {
            dragStateRef.current = null;
        };
    }, []);

    const handleDesktopTriggerClick = () => {
        if (!desktopPosition && isDesktop) {
            setDesktopPosition(getDefaultDesktopPosition());
            setHasLoadedDesktopPosition(true);
        }

        if (!open) {
            setOpen(true);
            return;
        }

        desktopPanelRef.current?.focus();
    };

    const handleDesktopHeaderPointerDown = (
        event: ReactPointerEvent<HTMLDivElement>,
    ) => {
        if (!desktopPanelRef.current) {
            return;
        }

        const target = event.target as HTMLElement;

        if (target.closest("[data-drag-ignore='true']")) {
            return;
        }

        const panelRect = desktopPanelRef.current.getBoundingClientRect();

        dragStateRef.current = {
            pointerId: event.pointerId,
            offsetX: event.clientX - panelRect.left,
            offsetY: event.clientY - panelRect.top,
        };

        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handleDesktopHeaderPointerMove = (
        event: ReactPointerEvent<HTMLDivElement>,
    ) => {
        if (!dragStateRef.current) {
            return;
        }

        if (dragStateRef.current.pointerId !== event.pointerId) {
            return;
        }

        setDesktopPosition(
            clampDesktopPosition(
                {
                    x: event.clientX - dragStateRef.current.offsetX,
                    y: event.clientY - dragStateRef.current.offsetY,
                },
                desktopPanelRef.current,
            ),
        );
    };

    const handleDesktopHeaderPointerUp = (
        event: ReactPointerEvent<HTMLDivElement>,
    ) => {
        if (!dragStateRef.current) {
            return;
        }

        if (dragStateRef.current.pointerId !== event.pointerId) {
            return;
        }

        dragStateRef.current = null;

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    };

    const navigationLinks = (
        <div className="space-y-2 p-3">
            {navigationItems.map(
                ({ to, label, description, icon: Icon, isActive }) => {
                    const active = isActive(location.pathname);

                    return (
                        <Link
                            key={to}
                            to={to}
                            className={cn(
                                "group flex items-center gap-4 rounded-[22px] border px-4 py-4 transition-all duration-200",
                                active
                                    ? "border-border/80 bg-accent shadow-sm"
                                    : "border-transparent hover:border-border/70 hover:bg-accent/70",
                            )}
                            onClick={isDesktop ? undefined : closeModal}
                        >
                            <div
                                className={cn(
                                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors",
                                    active
                                        ? "bg-primary/12 text-primary"
                                        : "bg-foreground/[0.05] text-muted-foreground group-hover:bg-foreground/[0.08] group-hover:text-foreground dark:bg-background/80",
                                )}
                            >
                                <Icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1 text-left">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-foreground">
                                        {label}
                                    </span>
                                    {active && (
                                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                                            現在地
                                        </span>
                                    )}
                                </div>
                                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                    {description}
                                </p>
                            </div>
                            <ChevronRight
                                className={cn(
                                    "h-4 w-4 shrink-0 transition-all duration-200",
                                    active
                                        ? "text-primary"
                                        : "text-muted-foreground group-hover:translate-x-0.5 group-hover:text-foreground",
                                )}
                            />
                        </Link>
                    );
                },
            )}
        </div>
    );

    const triggerButton = (
        <Button
            ref={triggerRef}
            variant="utility"
            className={cn(
                "h-10 w-10 rounded-full border-border/80 bg-background/70 px-0 shadow-none backdrop-blur-sm",
                open && isDesktop && "bg-accent",
            )}
            onClick={isDesktop ? handleDesktopTriggerClick : undefined}
        >
            <MenuIcon className="h-6 w-6" />
        </Button>
    );

    const mobileTrigger =
        !isDesktop && triggerAnchor
            ? createPortal(
                <DialogTrigger asChild>{triggerButton}</DialogTrigger>,
                triggerAnchor,
            )
            : null;

    const desktopTrigger =
        isDesktop && triggerAnchor
            ? createPortal(triggerButton, triggerAnchor)
            : null;

    const desktopMenu =
        isMounted &&
            isDesktop &&
            open &&
            desktopPosition &&
            hasLoadedDesktopPosition
            ? createPortal(
                <div
                    ref={desktopPanelRef}
                    role="dialog"
                    aria-modal="false"
                    aria-labelledby={titleId}
                    aria-describedby={descriptionId}
                    tabIndex={-1}
                    className="fixed z-[60] w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[28px] border border-border/70 bg-background/95 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.55)] backdrop-blur-xl outline-none animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
                    style={{
                        left: desktopPosition.x,
                        top: desktopPosition.y,
                    }}
                >
                    <div
                        className="flex items-start gap-4 border-b border-border/60 px-6 pb-4 pt-5"
                        onPointerDown={handleDesktopHeaderPointerDown}
                        onPointerMove={handleDesktopHeaderPointerMove}
                        onPointerUp={handleDesktopHeaderPointerUp}
                        onPointerCancel={handleDesktopHeaderPointerUp}
                    >
                        <div className="min-w-0 flex-1 cursor-grab select-none touch-none active:cursor-grabbing">
                            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                                <span>Menu</span>
                                <span className="h-1 w-1 rounded-full bg-border" />
                                <span className="text-[10px] tracking-[0.18em]">
                                    Drag
                                </span>
                            </div>
                            <h2
                                id={titleId}
                                className="mt-3 text-[1.35rem] font-semibold tracking-tight text-foreground"
                            >
                                すばやく移動
                            </h2>
                            <p
                                id={descriptionId}
                                className="mt-1 text-sm leading-6 text-muted-foreground"
                            >
                                主要な画面へショートカットできます。
                            </p>
                        </div>
                        <button
                            type="button"
                            data-drag-ignore="true"
                            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            onClick={closeModal}
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close menu</span>
                        </button>
                    </div>
                    {navigationLinks}
                    <div className="border-t border-border/60 px-6 py-4 text-xs text-muted-foreground">
                        ドラッグした位置は次回も保持されます。
                    </div>
                </div>,
                document.body,
            )
            : null
        ;

    if (isDesktop) {
        return (
            <>
                {desktopTrigger}
                {desktopMenu}
            </>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {mobileTrigger}
            <DialogContent className="w-[calc(100%-2rem)] max-w-sm gap-0 overflow-hidden rounded-[28px] border-border/70 bg-background/95 p-0 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.55)] backdrop-blur-xl">
                <DialogHeader className="border-b border-border/60 px-6 pb-4 pt-6 text-left">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                        Menu
                    </span>
                    <DialogTitle className="pr-10 text-[1.35rem] font-semibold tracking-tight">
                        すばやく移動
                    </DialogTitle>
                    <DialogDescription className="pr-10 text-sm leading-6">
                        主要な画面へショートカットできます。
                    </DialogDescription>
                </DialogHeader>
                {navigationLinks}
            </DialogContent>
        </Dialog>
    );
}
