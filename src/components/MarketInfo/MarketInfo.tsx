import React from "react";
import { MarketIcon } from "@/components/MarketSelector/MarketIcon";
import { useMarketStore } from "@/stores/marketStore";
import { ChevronDown } from "lucide-react";

interface MarketInfoProps {
    title: string;
    subtitle: string;
    onClick?: () => void;
    isMobile?: boolean;
}

export const MarketInfo: React.FC<MarketInfoProps> = ({
    title,
    subtitle,
    onClick,
    isMobile = false,
}) => {
    const selectedMarket = useMarketStore((state) => state.selectedMarket);

    if (isMobile) {
        return (
            <div className="inline-flex cursor-pointer mx-4 lg:mt-3" data-id="market-info">
                <div
                    className="flex items-center gap-4 px-4 py-3 bg-theme-secondary rounded-lg"
                    onClick={onClick}
                >
                    {selectedMarket && (
                        <div className="w-8 h-8 flex items-center justify-center">
                            <MarketIcon
                                symbol={selectedMarket.symbol}
                                size="xlarge"
                                showBadge={false}
                            />
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <div className="text-base font-bold text-theme leading-6 font-ibm-plex-sans truncate">
                                {title}
                            </div>
                            <ChevronDown className="w-4 h-6 text-theme flex-shrink-0 stroke-[1.5]" />
                        </div>
                        <div className="text-sm text-theme leading-5 font-ibm-plex-sans truncate">
                            {subtitle}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="inline-flex cursor-pointer bg-theme-secondary hover:bg-theme-hover active:bg-theme-active rounded-lg transition-colors"
            data-id="market-info"
            onClick={onClick}
        >
            <div className="flex items-center gap-4 px-4 py-3">
                {selectedMarket && (
                    <div className="w-8 h-8 flex items-center justify-center">
                        <MarketIcon
                            symbol={selectedMarket.symbol}
                            size="xlarge"
                            showBadge={false}
                        />
                    </div>
                )}
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <div className="text-base font-bold text-theme leading-6 font-ibm-plex-sans truncate">
                            {title}
                        </div>
                        <ChevronDown className="w-5 text-theme flex-shrink-0 stroke-[1.5]" />
                    </div>
                    <div className="text-sm text-theme leading-5 font-ibm-plex-sans truncate">
                        {subtitle}
                    </div>
                </div>
            </div>
        </div>
    );
};
