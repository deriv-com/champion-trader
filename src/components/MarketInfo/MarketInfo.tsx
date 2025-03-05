import React from "react"
import { MarketIcon } from "@/components/MarketSelector/MarketIcon"
import { useMarketStore } from "@/stores/marketStore"
import { ChevronDown } from "lucide-react"
import { useThemeStore } from "@/stores/themeStore";

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

  const { isDarkMode } = useThemeStore();
  const backgroundColor = isDarkMode ? "bg-sidebar" : "bg-gray-100";

  if (isMobile) {
    return (
      <div
        className="inline-flex cursor-pointer mx-4 mt-3"
        data-id="market-info"
        onClick={onClick}
      >
        <div className={`flex items-center gap-4 px-4 py-3 rounded-lg ${isDarkMode ? "bg-market-dark" : "bg-gray-100"}`}>
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
              <div className={`text-base font-bold ${isDarkMode ? "text-white" : "text-black/[0.72]"} text-secondary leading-6 font-ibm-plex-sans truncate`}>{title}</div>
              <ChevronDown className={`w-4 h-6 ${isDarkMode ? "text-white" : "text-black/[0.72]"} text-secondary flex-shrink-0 stroke-[1.5]"`} />
            </div>
            <div className={`text-sm ${isDarkMode ? "text-white" : "text-black/[0.48]"} text-secondary leading-5 font-ibm-plex-sans truncate`}>{subtitle}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`inline-flex cursor-pointer ${backgroundColor} active:bg-gray-200 active:bg-active-dark rounded-lg transition-colors`}
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
            <div className={`text-base font-bold ${isDarkMode ? "text-white" : "text-black"} leading-6 font-ibm-plex-sans truncate`}>{title}</div>
            <ChevronDown className={`w-5 ${isDarkMode ? "text-white" : "text-black"} flex-shrink-0 stroke-[1.5]"`} />
          </div>
          <div className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"} leading-5 font-ibm-plex-sans truncate`}>{subtitle}</div>
        </div>
      </div>
    </div>
  )
}
