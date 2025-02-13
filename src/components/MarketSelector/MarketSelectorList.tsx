import React, { useState } from "react"
import { Search, X, Loader2, Star } from "lucide-react"
import { useBottomSheetStore } from "@/stores/bottomSheetStore"
import { useTradeStore } from "@/stores/tradeStore"
import { useMarketStore } from "@/stores/marketStore"
import { useToastStore } from "@/stores/toastStore"
import { useLeftSidebarStore } from "@/stores/leftSidebarStore"
import { tabs, stubMarketGroups } from "./data"
import { MarketGroup } from "@/services/api/rest/types"
import { useInstruments } from "@/hooks/useInstruments"
import { MarketIcon } from "./MarketIcon"
import { ScrollableTabs } from "@/components/ui/scrollable-tabs"

interface MarketSelectorListProps {
  onDragDown?: () => void
}

interface ProcessedInstrument {
  symbol: string
  displayName: string
  shortName: string
  market_name: string
  isOneSecond: boolean
  isClosed?: boolean
  type: "volatility" | "boom" | "crash"
}

export const MarketSelectorList: React.FC<MarketSelectorListProps> = () => {
  const { setBottomSheet } = useBottomSheetStore()
  const { marketGroups, isLoading, error } = useInstruments()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const savedFavorites = localStorage.getItem("market-favorites")
    return savedFavorites ? new Set(JSON.parse(savedFavorites)) : new Set()
  })

  // Update localStorage when favorites change
  React.useEffect(() => {
    localStorage.setItem(
      "market-favorites",
      JSON.stringify(Array.from(favorites))
    )
  }, [favorites])

  const { toast } = useToastStore((state) => ({ toast: state.toast }))

  const toggleFavorite = (symbol: string) => (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault();
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      const isAdding = !newFavorites.has(symbol)
      
      if (isAdding) {
        newFavorites.add(symbol)
        toast({
          content: (
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              <span className="text-base">Added to favourites</span>
            </div>
          ),
          variant: "black",
          duration: 2000
        })
      } else {
        newFavorites.delete(symbol)
        toast({
          content: (
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              <span className="text-base">Removed from favourites</span>
            </div>
          ),
          variant: "black",
          duration: 2000
        })
      }
      return newFavorites
    })
  }

  const setInstrument = useTradeStore((state) => state.setInstrument)
  const { selectedMarket, setSelectedMarket } = useMarketStore()
  const { setLeftSidebar } = useLeftSidebarStore()

  // Set initial instrument based on default market
  React.useEffect(() => {
    if (selectedMarket) {
      setInstrument(selectedMarket.symbol)
    }
  }, [])

  const isBottomSheetOpenRef = React.useRef(true)

  const handleMarketSelect = (market: ProcessedInstrument) => {
    isBottomSheetOpenRef.current = false
    setInstrument(market.symbol)
    setSelectedMarket(market)
    setBottomSheet(false)
    setLeftSidebar(false)
  }

  // Reset isBottomSheetOpenRef when component mounts
  React.useEffect(() => {
    isBottomSheetOpenRef.current = true
  }, [])

  const formatSyntheticSymbol = (symbol: string): ProcessedInstrument => {
    const number = symbol.startsWith("1HZ")
      ? symbol.replace("1HZ", "").replace("V", "")
      : symbol.replace("R_", "")

    // Convert to format used in marketIcons
    const iconSymbol = symbol.startsWith("1HZ") ? symbol : `R_${number}`

    return {
      symbol: iconSymbol,
      displayName: `Volatility ${number}${
        symbol.startsWith("1HZ") ? " (1s)" : ""
      } Index`,
      shortName: number,
      market_name: "synthetic_index",
      isOneSecond: symbol.startsWith("1HZ"),
      type: "volatility",
      isClosed: symbol === "USDJPY",
    }
  }

  const formatCrashBoomSymbol = (symbol: string): ProcessedInstrument => {
    const type = symbol.startsWith("BOOM") ? "boom" : "crash"
    const number = symbol.replace(type.toUpperCase(), "").replace("N", "")
    
    // Convert to format used in marketIcons
    const iconSymbol = `${type.toUpperCase()}${number}${symbol.includes("N") ? "N" : ""}`

    return {
      symbol: iconSymbol,
      displayName: `${type.charAt(0).toUpperCase() + type.slice(1)} ${number} Index`,
      shortName: number,
      market_name: "crash_boom",
      isOneSecond: false,
      type,
      isClosed: false,
    }
  }

  const formatForexSymbol = (symbol: string): ProcessedInstrument => {
    const base = symbol.slice(0, 3)
    const quote = symbol.slice(3)

    // Convert to format used in marketIcons
    const iconSymbol = `frx${base}${quote}`

    return {
      symbol: iconSymbol,
      displayName: `${base}/${quote}`,
      shortName: base,
      market_name: "forex",
      isOneSecond: false,
      type: "volatility", // Using volatility icon for forex
      isClosed: symbol === "USDJPY",
    }
  }

  // Use stub data if marketGroups is null or empty
  const effectiveMarketGroups = (!marketGroups || marketGroups.length === 0) ? stubMarketGroups : marketGroups;

  // Process instruments from marketGroups to match our display needs
  const processedInstruments = effectiveMarketGroups.flatMap((group: MarketGroup) =>
    group.instruments
      .map((symbol) => {
        if (group.market_name === "synthetic_index") {
          return formatSyntheticSymbol(symbol)
        } else if (group.market_name === "crash_boom") {
          return formatCrashBoomSymbol(symbol)
        } else if (group.market_name === "forex") {
          return formatForexSymbol(symbol)
        }
        return null
      })
      .filter((item): item is ProcessedInstrument => item !== null)
  )

  const filteredInstruments = processedInstruments.filter((instrument) => {
    const matchesSearch = instrument.displayName
      .toLowerCase()
      .includes(searchQuery.toLowerCase())

    const marketTypeMap = {
      derived: "synthetic_index",
      forex: "forex",
      crash_boom: "crash_boom",
    }

    if (activeTab === "all") return matchesSearch
    if (activeTab === "favourites")
      return matchesSearch && favorites.has(instrument.symbol)
    return (
      matchesSearch &&
      instrument.market_name ===
        marketTypeMap[activeTab as keyof typeof marketTypeMap]
    )
  })

  // Group instruments by market_name
  const groupedInstruments = filteredInstruments.reduce((acc, instrument) => {
    if (!acc[instrument.market_name]) {
      acc[instrument.market_name] = []
    }
    acc[instrument.market_name].push(instrument)
    return acc
  }, {} as Record<string, ProcessedInstrument[]>)

  const marketTitles: Record<string, string> = {
    synthetic_index: "Synthetics",
    crash_boom: "Crash/Boom",
    forex: "Forex",
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header with centered title and close button */}
      <div className="flex items-center justify-between px-6 py-8">
        <div className="flex-1" />
        <h1 className="text-center font-ubuntu text-base font-bold overflow-hidden text-ellipsis text-black">Markets</h1>
        <div className="flex-1 flex justify-end">
          <button onClick={() => {
            setBottomSheet(false);
            setLeftSidebar(false);
          }} className="text-text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 pb-2">
        <div className="flex items-center h-8 px-2 gap-2 bg-black/[0.04] rounded-lg">
          <Search className="w-5 h-5 text-black/[0.24]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search markets on Rise/Fall"
            className="flex-1 bg-transparent outline-none font-ibm-plex-sans text-sm font-normal leading-[22px] text-black/[0.72] placeholder:text-black/[0.24] overflow-hidden text-ellipsis"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-black/[0.72] hover:text-black"
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
      <div className="flex-1 overflow-y-auto px-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-rose-500">{error}</div>
        ) : (
          <>
            {/* Market Groups */}
            <div>
              {Object.entries(groupedInstruments).map(
                ([marketName, markets]) => (
                  <div
                    key={marketName}
                    className="mb-6"
                  >
                    <h2 className="font-ibm-plex-sans text-sm font-normal leading-[22px] text-text-primary mb-2">
                      {marketTitles[marketName]}
                    </h2>
                    <div>
                      {marketName === "synthetic_index" && (
                        <h3 className="font-ibm-plex-sans text-xs font-normal leading-[18px] text-text-secondary mb-3">
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
                              ? "bg-black text-white"
                              : "cursor-pointer hover:bg-black/[0.08] active:bg-black/[0.16]"
                          }`}
                          onClick={() =>
                            !market.isClosed && handleMarketSelect(market)
                          }
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 flex items-center justify-center">
                              <MarketIcon
                                symbol={market.symbol}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-ibm-plex-sans text-sm font-normal leading-[22px] overflow-hidden text-ellipsis text-inherit">
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
                            className={`
                              ${favorites.has(market.symbol)
                                ? "text-yellow-400"
                                : selectedMarket?.symbol === market.symbol
                                ? "text-white"
                                : "text-text-tertiary"
                              }
                            `}
                          >
                            <Star
                              className={`w-5 h-5 ${
                                favorites.has(market.symbol)
                                  ? "fill-yellow-400"
                                  : selectedMarket?.symbol === market.symbol
                                  ? "stroke-white"
                                  : ""
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>

            {searchQuery && filteredInstruments.length === 0 && (
              <div className="p-4 text-center text-text-secondary font-ibm-plex-sans text-sm">
                No markets found matching "{searchQuery}"
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
