import React from "react"
import { MarketIcon } from "@/components/MarketSelector/MarketIcon"
import { useMarketStore } from "@/stores/marketStore"
import { ChevronDown } from "lucide-react"

interface MarketInfoProps {
  title: string
  subtitle: string
  onClick?: () => void
  isMobile?: boolean
}

export const MarketInfo: React.FC<MarketInfoProps> = ({
  title,
  subtitle,
  onClick,
  isMobile = false,
}) => {
  const selectedMarket = useMarketStore((state) => state.selectedMarket)

  if (isMobile) {
    return (
      <div
        className="w-full cursor-pointer"
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
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <div className="text-base font-bold text-black/[0.72] leading-6 font-ibm-plex-sans truncate">{title}</div>
              <ChevronDown className="w-4 h-6 text-black/[0.72] flex-shrink-0 stroke-[1.5]" />
            </div>
            <div className="text-sm text-black/[0.48] leading-5 font-ibm-plex-sans truncate">{subtitle}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="inline-flex cursor-pointer bg-white hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors"
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
            <div className="text-base font-bold text-black/[0.72] leading-6 font-ibm-plex-sans truncate">{title}</div>
            <ChevronDown className="w-5  text-black/[0.72] flex-shrink-0 stroke-[1.5]" />
          </div>
          <div className="text-sm text-black/[0.48] leading-5 font-ibm-plex-sans truncate">{subtitle}</div>
        </div>
      </div>
    </div>
  )
}
