import React from "react"
import { Card, CardContent } from "@/components/ui/card"
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
      <Card
        className="w-full bg-gray-50 cursor-pointer transition-colors border-transparent"
        data-id="market-info"
        onClick={onClick}
      >
        <CardContent className="flex items-center gap-4 px-4 py-0">
          {selectedMarket && (
            <MarketIcon
              symbol={selectedMarket.symbol}
              shortName={selectedMarket.shortName}
              isOneSecond={selectedMarket.isOneSecond}
              size="xlarge"
              showBadge={false}
            />
          )}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div>
            <div className="text-lg font-semibold text-gray-900">{title}</div>
            <div className="text-sm text-gray-500">{subtitle}</div>
            </div>
            <ChevronDown className="w-6 h-6 text-gray-900" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className="min-w-[220px] bg-white hover:bg-gray-50 cursor-pointer transition-colors border-transparent"
      data-id="market-info"
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-4 px-6 py-2">
        {selectedMarket && (
          <MarketIcon
            symbol={selectedMarket.symbol}
            shortName={selectedMarket.shortName}
            isOneSecond={selectedMarket.isOneSecond}
            size="xlarge"
            showBadge={false}
          />
        )}
        <div className="min-w-0">
          <div className="text-lg font-semibold text-gray-900">{title}</div>
          <div className="text-base text-gray-500">{subtitle}</div>
        </div>
      </CardContent>
    </Card>
  )
}
