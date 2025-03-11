import React from "react";
import { ChevronDown } from "lucide-react";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import { MarketIcon } from "./MarketIcon";

interface MarketSelectorButtonProps {
    symbol: string;
    price: string;
}

interface FormattedSymbol {
    number: string;
    isOneSecond: boolean;
    displayName: string;
    isForex: boolean;
    isClosed: boolean;
    iconSymbol: string;
}

export const MarketSelectorButton: React.FC<MarketSelectorButtonProps> = ({ symbol, price }) => {
    const formatSymbol = (symbol: string): FormattedSymbol => {
        const isOneSecond = symbol.startsWith("1HZ");
        const isForex = !symbol.includes("HZ") && !symbol.includes("R_");

        let number: string;
        let displayName: string;
        let iconSymbol: string;

        if (isForex) {
            const base = symbol.slice(0, 3);
            const quote = symbol.slice(3);
            number = base;
            displayName = `${base}/${quote}`;
            iconSymbol = `frx${base}${quote}`;
        } else {
            number = isOneSecond
                ? symbol.replace("1HZ", "").replace("V", "")
                : symbol.replace("R_", "");
            displayName = `Volatility ${number}${isOneSecond ? " (1s)" : ""} Index`;
            // For volatility indices, we need to ensure the format matches marketIcons
            // If it's already in R_ format, keep it, otherwise format it
            iconSymbol = symbol.includes("R_")
                ? symbol
                : symbol.startsWith("1HZ")
                  ? symbol
                  : `R_${number}`;
        }

        return {
            number,
            isOneSecond,
            displayName,
            isForex,
            iconSymbol,
            isClosed: symbol === "USDJPY",
        };
    };
    const { displayName, isClosed, iconSymbol } = formatSymbol(symbol);

    const { setOverlaySidebar } = useMainLayoutStore();

    const handleClick = () => {
        setOverlaySidebar(true, "market-list");
    };

    return (
        <button
            onClick={handleClick}
            className="flex items-center gap-3 px-4 py-3 bg-muted/50 hover:bg-muted/70 rounded-lg transition-colors"
        >
            <MarketIcon symbol={iconSymbol} size="large" />
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
                <span className="text-lg font-semibold">{price}</span>
            </div>
        </button>
    );
};
