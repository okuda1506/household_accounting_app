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
    Pin,
    PinOff,
    ReceiptText,
    Settings2,
    Tags,
    X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import type {
    DesktopMenuPosition,
    DragState,
    NavigationItem,
} from "../types/navigation";

const navigationItems: NavigationItem[] = [
    {
        to: "/",
        label: "ダッシュボード",
        description: "今月の収支と直近取引を確認",
        icon: LayoutDashboard,
        isActive: (pathname) => pathname === "/",
    },
    {
        to: "/categories",
        label: "カテゴリ",
        description: "費目の追加・編集を管理",
        icon: Tags,
        isActive: (pathname) => pathname.startsWith("/categories"),
    },
    {
        to: "/transactions",
        label: "取引",
        description: "入出金の記録と一覧を確認",
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
const DESKTOP_MENU_PINNED_STORAGE_KEY = "navigation-menu-desktop-pinned";
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
    const [isPinned, setIsPinned] = useState(false);
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
    const desktopPositionRef = useRef<DesktopMenuPosition | null>(null);
    const lastPinnedPositionRef = useRef<DesktopMenuPosition | null>(null);
    const dragStateRef = useRef<DragState | null>(null);
    const previousDesktopModeRef = useRef<boolean | null>(null);
    const previousPathnameRef = useRef(location.pathname);
    const titleId = useId();
    const descriptionId = useId();

    const closeModal = () => {
        setOpen(false);
    };

    const applyDesktopPanelPosition = (position: DesktopMenuPosition) => {
        desktopPositionRef.current = position;

        if (!desktopPanelRef.current) {
            return;
        }

        desktopPanelRef.current.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
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

        const savedPinnedState = window.localStorage.getItem(
            DESKTOP_MENU_PINNED_STORAGE_KEY,
        );

        setIsPinned(savedPinnedState === "true");

        const savedPosition = window.localStorage.getItem(
            DESKTOP_MENU_STORAGE_KEY,
        );

        if (!savedPosition) {
            const defaultPosition = getDefaultDesktopPosition();

            setDesktopPosition(defaultPosition);
            lastPinnedPositionRef.current = defaultPosition;
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
                const nextPosition = clampDesktopPosition(
                    {
                        x: parsedPosition.x,
                        y: parsedPosition.y,
                    },
                    desktopPanelRef.current,
                );

                setDesktopPosition(nextPosition);
                lastPinnedPositionRef.current = nextPosition;
            } else {
                const defaultPosition = getDefaultDesktopPosition();

                setDesktopPosition(defaultPosition);
                lastPinnedPositionRef.current = defaultPosition;
            }
        } catch (error) {
            console.error("Failed to parse desktop position from localStorage:", error);
            const defaultPosition = getDefaultDesktopPosition();

            setDesktopPosition(defaultPosition);
            lastPinnedPositionRef.current = defaultPosition;
        }

        setHasLoadedDesktopPosition(true);
    }, [isDesktop, isMounted]);

    useEffect(() => {
        if (
            !isMounted ||
            !isDesktop ||
            !isPinned ||
            !hasLoadedDesktopPosition ||
            !desktopPosition
        ) {
            return;
        }

        lastPinnedPositionRef.current = desktopPosition;

        window.localStorage.setItem(
            DESKTOP_MENU_STORAGE_KEY,
            JSON.stringify(desktopPosition),
        );
    }, [
        desktopPosition,
        hasLoadedDesktopPosition,
        isDesktop,
        isMounted,
        isPinned,
    ]);

    useEffect(() => {
        if (!isMounted || !isDesktop || !hasLoadedDesktopPosition) {
            return;
        }

        window.localStorage.setItem(
            DESKTOP_MENU_PINNED_STORAGE_KEY,
            isPinned ? "true" : "false",
        );
    }, [isDesktop, isMounted, isPinned]);

    useEffect(() => {
        if (!desktopPosition) {
            return;
        }

        applyDesktopPanelPosition(desktopPosition);
    }, [desktopPosition]);

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
        const hasPathChanged = previousPathnameRef.current !== location.pathname;

        previousPathnameRef.current = location.pathname;

        if (!isDesktop || isPinned || !hasPathChanged) {
            return;
        }

        setOpen(false);
    }, [isDesktop, isPinned, location.pathname]);

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
        if (!isDesktop || !open || isPinned) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target as Node | null;

            if (!target) {
                return;
            }

            if (desktopPanelRef.current?.contains(target)) {
                return;
            }

            if (triggerRef.current?.contains(target)) {
                return;
            }

            setOpen(false);
        };

        document.addEventListener("pointerdown", handlePointerDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
        };
    }, [isDesktop, isPinned, open]);

    useEffect(() => {
        return () => {
            dragStateRef.current = null;
        };
    }, []);

    const handleDesktopTriggerClick = () => {
        if (!isDesktop) {
            return;
        }

        if (isPinned) {
            const nextPosition =
                desktopPosition ??
                lastPinnedPositionRef.current ??
                getDefaultDesktopPosition();

            setDesktopPosition(
                clampDesktopPosition(nextPosition, desktopPanelRef.current),
            );
            setHasLoadedDesktopPosition(true);
        } else {
            setDesktopPosition(getDefaultDesktopPosition());
            setHasLoadedDesktopPosition(true);
        }

        if (!open) {
            setOpen(true);
            return;
        }

        if (!isPinned) {
            setOpen(false);
            return;
        }

        desktopPanelRef.current?.focus();
    };

    const handlePinToggle = () => {
        const nextPinned = !isPinned;

        if (!nextPinned && desktopPosition) {
            lastPinnedPositionRef.current = desktopPosition;
        }

        setIsPinned(nextPinned);

        if (nextPinned) {
            const nextPosition =
                lastPinnedPositionRef.current ??
                desktopPosition ??
                getDefaultDesktopPosition();

            setDesktopPosition(
                clampDesktopPosition(nextPosition, desktopPanelRef.current),
            );
            setOpen(true);
            return;
        }

        setDesktopPosition(getDefaultDesktopPosition());
    };

    const handleDesktopHeaderPointerDown = (
        event: ReactPointerEvent<HTMLDivElement>,
    ) => {
        if (!isPinned) {
            return;
        }

        if (!desktopPanelRef.current) {
            return;
        }

        if (event.button !== 0) {
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
        if (!isPinned) {
            return;
        }

        if (!dragStateRef.current) {
            return;
        }

        if (dragStateRef.current.pointerId !== event.pointerId) {
            return;
        }

        if ((event.buttons & 1) !== 1) {
            dragStateRef.current = null;

            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
            }

            return;
        }

        applyDesktopPanelPosition(
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
        if (!isPinned) {
            return;
        }

        if (!dragStateRef.current) {
            return;
        }

        if (dragStateRef.current.pointerId !== event.pointerId) {
            return;
        }

        dragStateRef.current = null;

        const nextPosition = desktopPositionRef.current;

        if (nextPosition) {
            setDesktopPosition((currentPosition) => {
                if (
                    currentPosition?.x === nextPosition.x &&
                    currentPosition?.y === nextPosition.y
                ) {
                    return currentPosition;
                }

                return nextPosition;
            });
        }

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    };

    const handleDesktopHeaderLostPointerCapture = () => {
        dragStateRef.current = null;
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
                            onClick={
                                !isDesktop || !isPinned
                                    ? closeModal
                                    : undefined
                            }
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
                                        <>
                                            <span
                                                aria-hidden="true"
                                                className="h-2 w-2 rounded-full bg-primary"
                                            />
                                            <span className="sr-only">
                                                現在地
                                            </span>
                                        </>
                                    )}
                                </div>
                                <p className="mt-1 truncate text-xs leading-4 text-muted-foreground">
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
                    className="fixed left-0 top-0 z-[60] w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[28px] border border-border/70 bg-background/95 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.55)] backdrop-blur-xl outline-none will-change-transform animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
                    style={{
                        transform: `translate3d(${desktopPosition.x}px, ${desktopPosition.y}px, 0)`,
                    }}
                >
                    <div
                        className="flex items-start gap-4 border-b border-border/60 px-6 pb-4 pt-5"
                        onPointerDown={handleDesktopHeaderPointerDown}
                        onPointerMove={handleDesktopHeaderPointerMove}
                        onPointerUp={handleDesktopHeaderPointerUp}
                        onPointerCancel={handleDesktopHeaderPointerUp}
                        onLostPointerCapture={handleDesktopHeaderLostPointerCapture}
                    >
                        <div
                            className={cn(
                                "min-w-0 flex-1 select-none",
                                isPinned &&
                                    "cursor-grab touch-none active:cursor-grabbing",
                            )}
                        >
                            <h2
                                id={titleId}
                                className="text-[1.35rem] font-semibold tracking-tight text-foreground"
                            >
                                ナビゲーション
                            </h2>
                            <div
                                id={descriptionId}
                                className="mt-2 space-y-2 text-xs leading-5 text-muted-foreground"
                            >
                                {isPinned ? (
                                    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-foreground/[0.03] px-3 py-1 text-[11px] leading-none">
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                                        <span>ドラッグ位置は次回も保持されます</span>
                                    </div>
                                ) : (
                                    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-foreground/[0.03] px-3 py-1 text-[11px] leading-none">
                                        <span className="h-1.5 w-1.5 rounded-full bg-border" />
                                        <span>未ピン時は画面遷移で閉じます</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2" data-drag-ignore="true">
                            <button
                                type="button"
                                data-drag-ignore="true"
                                aria-pressed={isPinned}
                                className={cn(
                                    "rounded-full p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                    isPinned
                                        ? "bg-accent text-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                                )}
                                onClick={handlePinToggle}
                            >
                                {isPinned ? (
                                    <PinOff className="h-4 w-4" />
                                ) : (
                                    <Pin className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                    {isPinned ? "Unpin menu" : "Pin menu"}
                                </span>
                            </button>
                            {!isPinned && (
                                <button
                                    type="button"
                                    data-drag-ignore="true"
                                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    onClick={closeModal}
                                >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">
                                        Close menu
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                    {navigationLinks}
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
                    <DialogTitle className="pr-10 text-[1.35rem] font-semibold tracking-tight">
                        ナビゲーション
                    </DialogTitle>
                </DialogHeader>
                {navigationLinks}
            </DialogContent>
        </Dialog>
    );
}
