import { type ReactNode } from "react";
import { Link } from "react-router-dom";

import { BrandLogo } from "./BrandLogo";
import { NavigationMenuAnchor } from "./NavigationModal";

type AppHeaderProps = {
    title: ReactNode;
};

export function AppHeader({ title }: AppHeaderProps) {
    return (
        <nav className="border-b border-border">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center">
                    <Link
                        to="/"
                        aria-label="KakeiFlow"
                        className="inline-flex items-center"
                    >
                        <BrandLogo
                            name="KakeiFlow"
                            iconClassName="h-10 w-10"
                            labelClassName="hidden text-xl sm:inline"
                        />
                    </Link>
                    <span className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold">
                        {title}
                    </span>
                    <NavigationMenuAnchor />
                </div>
            </div>
        </nav>
    );
}
