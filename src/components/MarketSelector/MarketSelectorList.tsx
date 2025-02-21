import React, { useState } from "react"
import { Search, X, Star } from "lucide-react"
import { useBottomSheetStore } from "@/stores/bottomSheetStore"
import { useTradeStore } from "@/stores/tradeStore"
import { useMarketStore } from "@/stores/marketStore"
import { useToastStore } from "@/stores/toastStore"
import { useMainLayoutStore } from "@/stores/mainLayoutStore"
import { tabs } from "./data"
import {
  marketData,
  MarketInfo,
  marketTitles,
  marketTypeMap,
} from "./marketSelectorStub"
import { MarketIcon } from "./MarketIcon"
import { ScrollableTabs } from "@/components/ui/scrollable-tabs"
import { useDeviceDetection } from "@/hooks/useDeviceDetection"

interface MarketSelectorListProps {
  onDragDown?: () => void
}

export const MarketSelectorList: React.FC<MarketSelectorListProps> = () => {
  const { setBottomSheet } = useBottomSheetStore()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { isMobile } = useDeviceDetection()
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
    e.preventDefault()
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      const isAdding = !newFavorites.has(symbol)

      if (isAdding) {
        newFavorites.add(symbol)
        toast({
          content: (
            <div className="flex items-center gap-3 bg-black text-white p-4 rounded-lg">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              <span className="text-base">Added to favourites</span>
            </div>
          ),
          variant: "black",
          duration: 2000,
          position: 'bottom-center'
        })
      } else {
        newFavorites.delete(symbol)
        toast({
          content: (
            <div className="flex items-center gap-3 bg-black text-white p-4 rounded-lg">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              <span className="text-base">Removed from favourites</span>
            </div>
          ),
          variant: "black",
          duration: 2000,
          position: 'bottom-center'
        })
      }
      return newFavorites
    })
  }

  const setInstrument = useTradeStore((state) => state.setInstrument)
  const { selectedMarket, setSelectedMarket } = useMarketStore()
  const { setOverlaySidebar } = useMainLayoutStore()

  // Set initial instrument based on default market
  React.useEffect(() => {
    if (selectedMarket) {
      setInstrument(selectedMarket.symbol)
    }
  }, [])

  const isBottomSheetOpenRef = React.useRef(true)

  const handleMarketSelect = (market: MarketInfo) => {
    isBottomSheetOpenRef.current = false
    setInstrument(market.symbol)
    setSelectedMarket(market)
    setBottomSheet(false)
    setOverlaySidebar(false)
  }

  // Reset isBottomSheetOpenRef when component mounts
  React.useEffect(() => {
    isBottomSheetOpenRef.current = true
  }, [])

  const filteredInstruments = marketData.filter((instrument) => {
    const matchesSearch = instrument.displayName
      .toLowerCase()
      .includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "favourites")
      return matchesSearch && favorites.has(instrument.symbol)
    return (
      matchesSearch &&
      instrument.market_name ===
        marketTypeMap[activeTab as keyof typeof marketTypeMap]
    )
  })

  // Group markets by market_name
  const groupedInstruments = filteredInstruments.reduce((acc, instrument) => {
    if (!acc[instrument.market_name]) {
      acc[instrument.market_name] = []
    }
    acc[instrument.market_name].push(instrument)
    return acc
  }, {} as Record<string, MarketInfo[]>)

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header with centered title and close button */}
      {!isMobile && (
        <div className="flex items-center justify-between px-6 py-8">
          <div className="flex-1" />
          <h1 className="text-center font-ubuntu text-base font-bold overflow-hidden text-ellipsis text-black">
            Markets
          </h1>
          <div className="flex-1 flex justify-end">
            <button
              onClick={() => {
                setBottomSheet(false)
                setOverlaySidebar(false)
              }}
              className="text-text-primary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

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
        {/* Market Groups */}
        <div>
          {Object.entries(groupedInstruments).map(([marketName, markets]) => (
            <div key={marketName} className="mb-6">
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
                        <MarketIcon symbol={market.symbol} />
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
                        e.stopPropagation()
                        toggleFavorite(market.symbol)(e)
                      }}
                      className={`
                              ${
                                favorites.has(market.symbol)
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
          ))}
        </div>

        {searchQuery && filteredInstruments.length === 0 && (
          <div className="p-4 text-center text-text-secondary font-ibm-plex-sans text-sm">
            No markets found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  )
}
