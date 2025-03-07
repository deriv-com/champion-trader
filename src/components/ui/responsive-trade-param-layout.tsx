import React from "react";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { HorizontalScrollList } from "./horizontal-scroll-list";

interface ResponsiveTradeParamLayoutProps {
    children: React.ReactNode;
}

export const ResponsiveTradeParamLayout = ({ children }: ResponsiveTradeParamLayoutProps) => {
    const { isDesktop } = useDeviceDetection();
    const childrenArray = React.Children.toArray(children);

    if (isDesktop) {
        return <>{children}</>;
    }

    // For 1 or 2 items, use grid layout
    if (childrenArray.length <= 2) {
        return (
            <div
                className={`grid ${childrenArray.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-4`}
            >
                {children}
            </div>
        );
    }

    // For 3+ items, use horizontal scroll
    return <HorizontalScrollList>{children}</HorizontalScrollList>;
};
