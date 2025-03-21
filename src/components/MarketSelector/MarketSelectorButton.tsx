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

    return (
        <button
            onClick={handleClick}
            className="flex items-center gap-3 px-4 py-3 bg-muted/50 hover:bg-muted/70 rounded-lg transition-colors w-auto"
        >
            {/* Only show icon if we have a valid instrument */}
            {instrument ? (
                <MarketIcon symbol={symbol} size="large" />
            ) : (
                <div className="w-[52px] h-[52px] flex items-center justify-center">
                    {isLoading && (
                        <div className="w-6 h-6 border-2 border-t-transparent border-theme rounded-full animate-spin"></div>
                    )}
                </div>
            )}
            <div className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                    <span className="text-base font-medium">{displayName}</span>
                    {isClosed && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-rose-500/10 rounded-full text-rose-500">
                            Closed
                        </span>
                    )}
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                    {price && <span className="text-lg font-semibold">{price}</span>}
                    {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
                </div>
            </div>
        </button>
    );
};
