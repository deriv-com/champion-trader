import React, { useState, useEffect } from "react"
import { Search, X, Loader2, Star } from "lucide-react"
import { useBottomSheetStore } from "@/stores/bottomSheetStore"
import { useTradeStore } from "@/stores/tradeStore"
import { tabs, stubMarketGroups } from "./data"
import { MarketGroup } from "@/services/api/rest/types"
import { useInstruments } from "@/hooks/useInstruments"
import { MarketIcon } from "./MarketIcon"

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
  useEffect(() => {
    localStorage.setItem(
      "market-favorites",
      JSON.stringify(Array.from(favorites))
    )
  }, [favorites])

  const toggleFavorite = (symbol: string) => (e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(symbol)) {
        newFavorites.delete(symbol)
      } else {
        newFavorites.add(symbol)
      }
      return newFavorites
    })
  }

  const setInstrument = useTradeStore((state) => state.setInstrument)

  const handleMarketSelect = (market: ProcessedInstrument) => {
    setInstrument(market.symbol)
    setBottomSheet(false)
  }

  const formatSyntheticSymbol = (symbol: string): ProcessedInstrument => {
    const number = symbol.startsWith("1HZ")
      ? symbol.replace("1HZ", "").replace("V", "")
      : symbol.replace("R_", "")

    return {
      symbol,
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
    
    return {
      symbol,
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
    return {
      symbol,
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
      {/* Search Bar */}
      <div className="p-4">
        <div className="flex items-center gap-3 bg-muted/50 rounded-lg px-4 py-3">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search markets on Rise/Fall"
            className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Market Categories */}
      <div
        className="flex overflow-x-auto scrollbar-none scroll-smooth"
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="flex min-w-max px-4 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-lg font-medium whitespace-nowrap transition-colors relative ${
                activeTab === tab.id
                  ? "text-foreground after:absolute after:left-0 after:right-0 after:bottom-0 after:h-0.5 after:bg-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Market List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-rose-500">{error}</div>
        ) : (
          <>
            {/* Market Groups */}
            <div className="px-4">
              {Object.entries(groupedInstruments).map(
                ([marketName, markets], index) => (
                  <div
                    key={marketName}
                    className={`${
                      index > 0 ? "border-t border-border pt-8" : ""
                    } mb-8`}
                  >
                    <h2 className="text-[15px] font-medium mb-4">
                      {marketTitles[marketName]}
                    </h2>
                    <div className="space-y-4">
                      {marketName === "synthetic_index" && (
                        <h3 className="text-sm text-muted-foreground">
                          Continuous Indices
                        </h3>
                      )}
                      {markets.map((market) => (
                        <div
                          key={market.symbol}
                          className={`flex items-center justify-between py-2 px-2 -mx-2 rounded-lg transition-colors ${
                            market.isClosed
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-muted/50 cursor-pointer"
                          }`}
                          onClick={() =>
                            !market.isClosed && handleMarketSelect(market)
                          }
                        >
                          <div className="flex items-center gap-3">
                            <MarketIcon
                              type={market.type}
                              value={market.shortName}
                              isOneSecond={market.isOneSecond}
                            />
                            <div className="flex items-center gap-2">
                              <span className="text-[15px]">
                                {market.displayName}
                              </span>
                              {market.isClosed && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-rose-500/10 rounded-full text-rose-500">
                                  Closed
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={toggleFavorite(market.symbol)}
                            className={
                              favorites.has(market.symbol)
                                ? "text-primary"
                                : "text-muted-foreground hover:text-foreground"
                            }
                          >
                            <Star
                              className={`w-5 h-5 ${
                                favorites.has(market.symbol)
                                  ? "fill-current"
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
              <div className="p-4 text-center text-muted-foreground">
                No markets found matching "{searchQuery}"
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
