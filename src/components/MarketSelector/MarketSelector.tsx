import React from "react";
import { MarketSidebar } from "@/components/ui/market-sidebar";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";

export const MarketSelector: React.FC = () => {
    const { isOverlaySidebarOpen: isOpen } = useMainLayoutStore();

    // Only render when open to save memory
    if (!isOpen) return null;

    return <MarketSidebar />;
};
