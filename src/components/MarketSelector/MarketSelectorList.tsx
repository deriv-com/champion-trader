import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { useTradeStore } from "@/stores/tradeStore";
import { useMarketStore } from "@/stores/marketStore";
import { useToastStore } from "@/stores/toastStore";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import { tabs } from "./data";
import { marketData, MarketInfo, marketTitles, marketTypeMap } from "./marketSelectorStub";
import { MarketIcon } from "./MarketIcon";
import { ScrollableTabs } from "@/components/ui/scrollable-tabs";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { StandaloneStarFillIcon, StandaloneStarRegularIcon } from "@deriv/quill-icons";

interface MarketSelectorListProps {
    onDragDown?: () => void;
}

export const MarketSelectorList: React.FC<MarketSelectorListProps> = () => {
    const { setBottomSheet } = useBottomSheetStore();
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const { isMobile } = useDeviceDetection();
    const { theme } = useMainLayoutStore();
    const [favorites, setFavorites] = useState<Set<string>>(() => {
        const savedFavorites = localStorage.getItem("market-favorites");
        return savedFavorites ? new Set(JSON.parse(savedFavorites)) : new Set();
    });

    // Update localStorage when favorites change
    React.useEffect(() => {
        localStorage.setItem("market-favorites", JSON.stringify(Array.from(favorites)));
    }, [favorites]);

    const { toast } = useToastStore((state) => ({ toast: state.toast }));

    const toggleFavorite = (symbol: string) => (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setFavorites((prev) => {
            const newFavorites = new Set(prev);
            const isAdding = !newFavorites.has(symbol);

            if (isAdding) {
                newFavorites.add(symbol);
            } else {
                newFavorites.delete(symbol);
            }

            toast({
                className: "max-w-full w-[334px]",
                content: (
                    <div className="w-full h-12 flex items-center gap-3 bg-theme-text text-theme-bg p-2 pl-4 rounded-lg">
                        {isAdding ? (
                            <StandaloneStarFillIcon fill="#F7C60B" iconSize="sm" />
                        ) : (
                            <StandaloneStarRegularIcon
                                fill={theme === "light" ? "#ffffff" : "#000000B8"}
                                iconSize="sm"
                            />
                        )}
                        <span className="text-sm">
                            {isAdding ? "Added" : "Removed"} from favourites
                        </span>
                    </div>
                ),
                duration: 2000,
                position: "bottom-center",
            });

            return newFavorites;
        });
    };

    const setInstrument = useTradeStore((state) => state.setInstrument);
    const { selectedMarket, setSelectedMarket } = useMarketStore();
    const { setOverlaySidebar } = useMainLayoutStore();

    // Set initial instrument based on default market
    React.useEffect(() => {
        if (selectedMarket) {
            setInstrument(selectedMarket.symbol);
        }
    }, []);

    const isBottomSheetOpenRef = React.useRef(true);

    const handleMarketSelect = (market: MarketInfo) => {
        isBottomSheetOpenRef.current = false;
        setInstrument(market.symbol);
        setSelectedMarket(market);
        setBottomSheet(false);
        setOverlaySidebar(false);
    };

    // Reset isBottomSheetOpenRef when component mounts
    React.useEffect(() => {
        isBottomSheetOpenRef.current = true;
    }, []);

    const filteredInstruments = marketData.filter((instrument) => {
        const matchesSearch = instrument.displayName
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        if (activeTab === "all") return matchesSearch;
        if (activeTab === "favourites") return matchesSearch && favorites.has(instrument.symbol);
        return (
            matchesSearch &&
            instrument.market_name === marketTypeMap[activeTab as keyof typeof marketTypeMap]
        );
    });

    // Group markets by market_name
    const groupedInstruments = filteredInstruments.reduce(
        (acc, instrument) => {
            if (!acc[instrument.market_name]) {
                acc[instrument.market_name] = [];
            }
            acc[instrument.market_name].push(instrument);
            return acc;
        },
        {} as Record<string, MarketInfo[]>
    );

    return (
        <div className="flex flex-col h-full bg-theme-bg">
            {/* Header with centered title and close button */}
            {!isMobile && (
                <div className="flex items-center justify-between px-6 py-8">
                    <div className="flex-1" />
                    <h1 className="text-center text-base font-bold overflow-hidden text-ellipsis text-theme">
                        Markets
                    </h1>
                    <div className="flex-1 flex justify-end">
                        <button
                            onClick={() => {
                                setBottomSheet(false);
                                setOverlaySidebar(false);
                            }}
                            className="text-theme-muted hover:text-theme"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            <div className="px-6 pb-2">
                <div className="flex items-center h-8 px-2 gap-2 bg-theme-secondary rounded-lg">
                    <Search className="w-5 h-5 text-theme-muted" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search markets on Rise/Fall"
                        className="flex-1 bg-transparent outline-none text-sm font-normal leading-[22px] text-theme placeholder:text-theme-muted overflow-hidden text-ellipsis"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="text-theme-muted hover:text-theme"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Market Categories */}
            <ScrollableTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                className="mb-4"
            />

            {/* Market List */}
            <div className="flex-1 overflow-y-auto px-6 scrollbar-thin">
                {/* Empty state for favourites tab */}
                {activeTab === "favourites" && favorites.size === 0 && !searchQuery && (
                    <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                        <StandaloneStarRegularIcon
                            fill="#D1D5DB"
                            iconSize="2xl"
                            className=" mb-4"
                        />
                        <h3 className="text-lg font-semibold text-gray-500 mb-2">No favourites</h3>
                        <p className="text-sm text-gray-400">
                            Your favourite markets will appear here.
                        </p>
                    </div>
                )}

                {/* Market Groups */}
                <div>
                    {Object.entries(groupedInstruments).map(([marketName, markets]) => (
                        <div key={marketName} className="mb-6">
                            <h2 className="text-sm font-normal leading-[22px] text-theme mb-2">
                                {marketTitles[marketName]}
                            </h2>
                            <div>
                                {marketName === "synthetic_index" && (
                                    <h3 className="text-xs font-normal leading-[18px] text-theme-muted mb-3">
                                        Continuous Indices
                                    </h3>
                                )}
                                {markets.map((market) => (
                                    <div
                                        key={market.symbol}
                                        className={`flex items-center justify-between py-2 px-4 -mx-2 rounded-lg transition-all ${
                                            market.isClosed
                                                ? "cursor-not-allowed"
                                                : selectedMarket?.symbol === market.symbol
                                                  ? "bg-theme-text text-theme-bg"
                                                  : "cursor-pointer hover:bg-theme-hover active:bg-theme-active"
                                        }`}
                                        onClick={() =>
                                            !market.isClosed && handleMarketSelect(market)
                                        }
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-8 h-8 flex items-center justify-center">
                                                <MarketIcon symbol={market.symbol} />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-normal leading-[22px] overflow-hidden text-ellipsis text-inherit">
                                                    {market.displayName}
                                                </span>
                                                {market.isClosed && (
                                                    <span className="flex h-6 min-h-6 max-h-6 px-2 justify-center items-center gap-2 bg-[rgba(230,25,14,0.08)] rounded text-rose-500 text-xs font-normal leading-[18px] uppercase">
                                                        CLOSED
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(market.symbol)(e);
                                            }}
                                            data-testid="star-icon"
                                        >
                                            {favorites.has(market.symbol) ? (
                                                <StandaloneStarFillIcon
                                                    fill="#F7C60B"
                                                    iconSize="sm"
                                                />
                                            ) : (
                                                <StandaloneStarRegularIcon
                                                    fill={
                                                        selectedMarket?.symbol === market.symbol
                                                            ? theme === "light"
                                                                ? "#ffffff"
                                                                : "#000000B8"
                                                            : theme === "light"
                                                              ? "#000000B8"
                                                              : "#ffffff"
                                                    }
                                                    iconSize="sm"
                                                />
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {searchQuery && filteredInstruments.length === 0 && (
                    <div className="p-4 text-center text-theme-muted text-sm">
                        No markets found matching "{searchQuery}"
                    </div>
                )}
            </div>
        </div>
    );
};
