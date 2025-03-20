import React, { useState, useMemo } from "react";
import { Search, X, Star } from "lucide-react";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { useTradeStore } from "@/stores/tradeStore";
import { useMarketStore } from "@/stores/marketStore";
import { useToastStore } from "@/stores/toastStore";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import { MarketIcon } from "./MarketIcon";
import { ScrollableTabs } from "@/components/ui/scrollable-tabs";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { Instrument } from "@/api/services/instrument/types";

// Market category tabs
interface Tab {
    id: string;
    label: string;
}

interface MarketSelectorListProps {
    onDragDown?: () => void;
}

export const MarketSelectorList: React.FC<MarketSelectorListProps> = () => {
    const { setBottomSheet } = useBottomSheetStore();
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const { isMobile } = useDeviceDetection();
    const [favorites, setFavorites] = useState<Set<string>>(() => {
        const savedFavorites = localStorage.getItem("market-favorites");
        return savedFavorites ? new Set(JSON.parse(savedFavorites)) : new Set();
    });

    // Get instruments data from the market store
    const { instruments, isLoading, error, selectedMarket, setSelectedMarket } = useMarketStore();

    // Helper function to normalize category names (convert to lowercase and replace spaces with underscores)
    const normalizeCategory = (category: string): string => {
        return category.toLowerCase().replace(/\s+/g, "_");
    };

    // Helper function to format category names for display (capitalize first letter of each word)
    const formatCategoryForDisplay = (category: string): string => {
        return category
            .split(/[\s_]+/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };

    // Generate tabs dynamically from instruments
    const { tabs, marketTitles } = useMemo<{
        tabs: Tab[];
        marketTitles: { [key: string]: string };
        marketTypeMap: { [key: string]: string };
    }>(() => {
        // Default tabs that are always present
        const defaultTabs: Tab[] = [
            { id: "favourites", label: "Favourites" },
            { id: "all", label: "All" },
        ];

        // Maps to store unique categories and their display names
        const categoryMap = new Map<string, string>();
        const titlesMap: { [key: string]: string } = {};
        const typeMap: { [key: string]: string } = {};

        // Process instruments to extract categories
        instruments.forEach((instrument) => {
            if (instrument.categories && instrument.categories.length > 0) {
                // First category is the main category (e.g., "forex" or "Forex")
                const mainCategory = instrument.categories[0];

                // Normalize the category name for internal use
                const normalizedCategory = normalizeCategory(mainCategory);

                // Use the original category name for display, but format it consistently
                const displayName = formatCategoryForDisplay(mainCategory);

                // Add to category map if not already present
                if (!categoryMap.has(normalizedCategory)) {
                    categoryMap.set(normalizedCategory, displayName);

                    // Add to titles map
                    titlesMap[normalizedCategory] = displayName;

                    // Add to type map (mapping from tab ID to normalized category)
                    typeMap[normalizedCategory] = normalizedCategory;
                }
            }
        });

        // Convert category map to tabs array
        const dynamicTabs = Array.from(categoryMap.entries()).map(([id, label]) => ({ id, label }));

        // Combine default tabs with dynamic tabs
        return {
            tabs: [...defaultTabs, ...dynamicTabs],
            marketTitles: { ...titlesMap, other: "Other Markets" },
            marketTypeMap: typeMap,
        };
    }, [instruments]);
    // Update localStorage when favorites change
    React.useEffect(() => {
        localStorage.setItem("market-favorites", JSON.stringify(Array.from(favorites)));
    }, [favorites]);

    const { toast } = useToastStore((state) => ({ toast: state.toast }));

    const toggleFavorite = (id: string) => (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setFavorites((prev) => {
            const newFavorites = new Set(prev);
            const isAdding = !newFavorites.has(id);

            if (isAdding) {
                newFavorites.add(id);
                toast({
                    content: (
                        <div className="flex items-center gap-3 bg-theme-text text-theme-bg p-4 rounded-lg">
                            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                            <span className="text-base">Added to favourites</span>
                        </div>
                    ),
                    variant: "default",
                    duration: 2000,
                    position: "bottom-center",
                });
            } else {
                newFavorites.delete(id);
                toast({
                    content: (
                        <div className="flex items-center gap-3 bg-theme-text text-theme-bg p-4 rounded-lg">
                            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                            <span className="text-base">Removed from favourites</span>
                        </div>
                    ),
                    variant: "default",
                    duration: 2000,
                    position: "bottom-center",
                });
            }
            return newFavorites;
        });
    };

    const setInstrument = useTradeStore((state) => state.setInstrument);
    const { setOverlaySidebar } = useMainLayoutStore();

    // Set initial instrument based on default market
    React.useEffect(() => {
        if (selectedMarket) {
            setInstrument(selectedMarket.id);
        }
    }, [selectedMarket, setInstrument]);

    const isBottomSheetOpenRef = React.useRef(true);

    const handleMarketSelect = (instrument: Instrument) => {
        isBottomSheetOpenRef.current = false;
        setInstrument(instrument.id);
        setSelectedMarket(instrument);
        setBottomSheet(false);
        setOverlaySidebar(false);
    };

    // Reset isBottomSheetOpenRef when component mounts
    React.useEffect(() => {
        isBottomSheetOpenRef.current = true;
    }, []);

    const filteredInstruments = useMemo(() => {
        if (!instruments) return [];

        return instruments.filter((instrument) => {
            const matchesSearch = instrument.display_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

            // Get the main category from the instrument and normalize it
            const mainCategory =
                instrument.categories && instrument.categories.length > 0
                    ? normalizeCategory(instrument.categories[0])
                    : "other";

            if (activeTab === "all") return matchesSearch;
            if (activeTab === "favourites") return matchesSearch && favorites.has(instrument.id);
            return matchesSearch && mainCategory === activeTab;
        });
    }, [instruments, searchQuery, activeTab, favorites, normalizeCategory]);

    // Group markets by main category
    const groupedInstruments = useMemo(() => {
        return filteredInstruments.reduce(
            (acc, instrument) => {
                // Get the main category from the instrument and normalize it
                const mainCategory =
                    instrument.categories && instrument.categories.length > 0
                        ? normalizeCategory(instrument.categories[0])
                        : "other";

                if (!acc[mainCategory]) {
                    acc[mainCategory] = [];
                }
                acc[mainCategory].push(instrument);
                return acc;
            },
            {} as Record<string, Instrument[]>
        );
    }, [filteredInstruments, normalizeCategory]);

    if (isLoading) {
        return (
            <div className="flex flex-col h-full bg-theme-bg items-center justify-center">
                <div className="text-theme">Loading markets...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col h-full bg-theme-bg items-center justify-center">
                <div className="text-rose-500">Error loading markets: {error}</div>
                <button
                    className="mt-4 px-4 py-2 bg-theme-text text-theme-bg rounded-lg"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-theme-bg">
            {/* Header with centered title and close button */}
            {!isMobile && (
                <div className="flex items-center justify-between px-6 py-8">
                    <div className="flex-1" />
                    <h1 className="text-center font-ubuntu text-base font-bold overflow-hidden text-ellipsis text-theme">
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
                        className="flex-1 bg-transparent outline-none font-ibm-plex-sans text-sm font-normal leading-[22px] text-theme placeholder:text-theme-muted overflow-hidden text-ellipsis"
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
                {/* Market Groups */}
                <div>
                    {Object.entries(groupedInstruments).map(([marketName, markets]) => (
                        <div key={marketName} className="mb-6">
                            <h2 className="font-ibm-plex-sans text-sm font-normal leading-[22px] text-theme mb-2">
                                {/* Display the formatted category name or fallback to the raw category name */}
                                {marketTitles[marketName] || formatCategoryForDisplay(marketName)}
                            </h2>
                            <div>
                                {/* Show subcategory if available */}
                                {markets.length > 0 &&
                                    markets[0].categories &&
                                    markets[0].categories.length > 1 && (
                                        <h3 className="font-ibm-plex-sans text-xs font-normal leading-[18px] text-theme-muted mb-3">
                                            {formatCategoryForDisplay(markets[0].categories[1])}
                                        </h3>
                                    )}
                                {markets.map((instrument) => (
                                    <div
                                        key={instrument.id}
                                        className={`flex items-center justify-between py-2 px-4 -mx-2 rounded-lg transition-all ${
                                            !instrument.is_market_open
                                                ? "cursor-not-allowed"
                                                : selectedMarket?.id === instrument.id
                                                  ? "bg-theme-text text-theme-bg"
                                                  : "cursor-pointer hover:bg-theme-hover active:bg-theme-active"
                                        }`}
                                        onClick={() =>
                                            instrument.is_market_open &&
                                            handleMarketSelect(instrument)
                                        }
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-8 h-8 flex items-center justify-center">
                                                <MarketIcon symbol={instrument.id} />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-ibm-plex-sans text-sm font-normal leading-[22px] overflow-hidden text-ellipsis text-inherit">
                                                    {instrument.display_name}
                                                </span>
                                                {!instrument.is_market_open && (
                                                    <span className="flex h-6 min-h-6 max-h-6 px-2 justify-center items-center gap-2 bg-[rgba(230,25,14,0.08)] rounded text-rose-500 text-xs font-normal leading-[18px] uppercase">
                                                        CLOSED
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(instrument.id)(e);
                                            }}
                                            className={`
                              ${
                                  favorites.has(instrument.id)
                                      ? "text-yellow-400"
                                      : selectedMarket?.id === instrument.id
                                        ? "text-theme-bg"
                                        : "text-theme-muted"
                              }
                            `}
                                        >
                                            <Star
                                                className={`w-5 h-5 ${
                                                    favorites.has(instrument.id)
                                                        ? "fill-yellow-400"
                                                        : selectedMarket?.id === instrument.id
                                                          ? "stroke-theme-bg"
                                                          : ""
                                                }`}
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {searchQuery && filteredInstruments.length === 0 && (
                    <div className="p-4 text-center text-theme-muted font-ibm-plex-sans text-sm">
                        No markets found matching "{searchQuery}"
                    </div>
                )}
            </div>
        </div>
    );
};
