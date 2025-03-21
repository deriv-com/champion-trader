import React, { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { MarketIcon } from "./MarketIcon";
import { useMarketStore } from "@/stores/marketStore";
import { useInstrumentUtils } from "@/hooks/instrument";

interface MarketSelectorButtonProps {
    symbol: string;
    price?: string;
    subtitle?: string;
}

export const MarketSelectorButton: React.FC<MarketSelectorButtonProps> = ({
    symbol,
    price,
    subtitle,
}) => {
    const { instruments, isLoading } = useMarketStore();

    const { getInstrumentById } = useInstrumentUtils();

    // Find the instrument by ID
    const instrument = useMemo(() => {
        return getInstrumentById(symbol);
    }, [symbol, getInstrumentById]);

    // Get display name from instrument data
    const displayName = useMemo(() => {
        if (instrument) {
            return instrument.display_name;
        }

        // If we're still loading, show a loading message
        if (isLoading) {
            return "Loading markets...";
        }

        // If we have instruments but none match
        if (instruments.length > 0 && !isLoading) {
            return "Selecting market...";
        }

        return ""; // No fallback, rely on API data only
    }, [instrument, isLoading, instruments]);

    // Check if market is closed
    const isClosed = useMemo(() => {
        return instrument ? !instrument.is_market_open : false;
    }, [instrument]);

    const { setOverlaySidebar } = useMainLayoutStore();
    const { setBottomSheet } = useBottomSheetStore();
    const { isMobile } = useDeviceDetection();

    const handleClick = () => {
        if (isMobile) {
            // Use the same key as in TradePage.tsx
            setBottomSheet(true, "market-info", "80%");
        } else {
            setOverlaySidebar(true, "market-list");
        }
    };

    // Combine price and subtitle for display
    const displaySubtitle = useMemo(() => {
        if (price && subtitle) {
            return `${price} · ${subtitle}`;
        }
        return price || subtitle || "";
    }, [price, subtitle]);

    if (isMobile) {
        return (
            <div className="h-14 inline-flex cursor-pointer lg:mt-3" data-id="market-info">
                <div
                    className="h14 flex items-center gap-4 px-4 bg-theme-secondary rounded-lg font-medium"
                    onClick={handleClick}
                >
                    {/* Only show icon if we have a valid instrument */}
                    {instrument ? (
                        <div className="w-8 h-8 flex items-center justify-center">
                            <MarketIcon symbol={symbol} size="xlarge" showBadge={false} />
                        </div>
                    ) : (
                        <div className="w-8 h-8 flex items-center justify-center">
                            {isLoading && (
                                <div className="w-6 h-6 border-2 border-t-transparent border-theme rounded-full animate-spin"></div>
                            )}
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <div className="text-sm font-semibold text-theme leading-6 truncate">
                                {displayName}
                            </div>
                            {isClosed && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-rose-500/10 rounded-full text-rose-500">
                                    Closed
                                </span>
                            )}
                            <ChevronDown className="w-4 h-6 text-theme flex-shrink-0 stroke-[1.5]" />
                        </div>
                        <div className="text-[12px] text-theme leading-5 truncate">
                            {displaySubtitle}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="h-14 inline-flex cursor-pointer bg-theme-secondary hover:bg-theme-hover active:bg-theme-active rounded-lg transition-colors"
            data-id="market-info"
            onClick={handleClick}
        >
            <div className="h-14 flex items-center gap-4 px-4">
                {/* Only show icon if we have a valid instrument */}
                {instrument ? (
                    <div className="w-8 h-8 flex items-center justify-center">
                        <MarketIcon symbol={symbol} size="xlarge" showBadge={false} />
                    </div>
                ) : (
                    <div className="w-8 h-8 flex items-center justify-center">
                        {isLoading && (
                            <div className="w-6 h-6 border-2 border-t-transparent border-theme rounded-full animate-spin"></div>
                        )}
                    </div>
                )}
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-theme leading-6 truncate">
                            {displayName}
                        </div>
                        {isClosed && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-rose-500/10 rounded-full text-rose-500">
                                Closed
                            </span>
                        )}
                        <ChevronDown className="w-5 text-theme flex-shrink-0 stroke-[1.5]" />
                    </div>
                    <div className="text-[12px] text-theme leading-5 truncate rounded-[8px]">
                        {displaySubtitle}
                    </div>
                </div>
            </div>
        </div>
    );
};
