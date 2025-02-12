import React, { Suspense, lazy, useState } from "react"
import { useOrientationStore } from "@/stores/orientationStore"
import { BalanceDisplay } from "@/components/BalanceDisplay"
import { BottomSheet } from "@/components/BottomSheet"
import { DurationOptions } from "@/components/DurationOptions"
import { Card, CardContent } from "@/components/ui/card"
import { TradeFormController } from "./components/TradeFormController"
import { useBottomSheetStore } from "@/stores/bottomSheetStore"
import { MarketSelector } from "@/components/MarketSelector"
import { useTradeStore } from "@/stores/tradeStore"
import { useDeviceDetection } from "@/hooks/useDeviceDetection"
import { useLeftSidebarStore } from "@/stores/leftSidebarStore"

const Chart = lazy(() =>
  import("@/components/Chart").then((module) => ({
    default: module.Chart,
  }))
)

interface MarketInfoProps {
  title: string
  subtitle: string
  onClick?: () => void
}

const MarketInfo: React.FC<MarketInfoProps> = ({
  title,
  subtitle,
  onClick,
}) => (
  <Card
    className="flex-1 min-w-[180px]"
    data-id="market-info"
    onClick={onClick}
  >
    <CardContent className="flex items-center gap-3 p-3">
      <div className="min-w-0">
        <div className="text-sm font-bold text-gray-700">{title}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </div>
    </CardContent>
  </Card>
)

export const TradePage: React.FC = () => {
  const { isLandscape } = useOrientationStore()
  const { setBottomSheet } = useBottomSheetStore()
  const { isMobile } = useDeviceDetection()
  const selectedInstrument = useTradeStore((state) => state.instrument)
  const { setLeftSidebar } = useLeftSidebarStore()
  
  const handleMarketSelect = React.useCallback(() => {
    if (isMobile) {
      setBottomSheet(true, "market-info", "90%")
    } else {
      setLeftSidebar(true, "Select Market")
    }
  }, [isMobile, setBottomSheet, setLeftSidebar])

  // Get display name for the selected instrument
  const getDisplayName = (symbol: string) => {
    if (symbol.startsWith("1HZ")) {
      const number = symbol.replace("1HZ", "").replace("V", "")
      return `Vol. ${number} (1s) Index`
    }
    if (symbol.startsWith("R_")) {
      const number = symbol.replace("R_", "")
      return `Vol. ${number} Index`
    }
    return symbol
  }

  return (
    <div
      className={`flex ${
        isLandscape ? "flex-row relative" : "flex-col"
      } flex-1 h-[100dvh]`}
      data-testid="trade-page"
    >
      {isLandscape && (
        <div
          className="absolute top-0 left-0 right-0 bg-white z-10 border-b border-opacity-10"
          id="instrument-tab-bar"
        >
          <div className="flex items-center w-full gap-2 px-4 py-2 justify-between">
            <div className="flex items-center gap-2">
              <MarketInfo
                title={getDisplayName(selectedInstrument)}
                subtitle="Rise/Fall"
                onClick={handleMarketSelect}
              />
            </div>
            <BalanceDisplay />
          </div>
        </div>
      )}

      <div
        className={`flex flex-col flex-1 ${
          isLandscape ? "w-[70%] min-w-0" : ""
        } overflow-hidden`}
      >
        {!isLandscape && (
          <div className="flex items-center w-full gap-2 p-4 justify-between">
            <div className="flex items-center gap-2">
              <MarketInfo
                title={getDisplayName(selectedInstrument)}
                subtitle="Rise/Fall"
                onClick={handleMarketSelect}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col flex-1 min-h-0">
          <div className={`flex-1 relative ${isLandscape ? "mt-[78px]" : ""}`}>
            <Suspense fallback={<div>Loading...</div>}>
              <Chart className="flex-1 absolute inset-0" />
            </Suspense>
          </div>

          <Suspense fallback={<div>Loading...</div>}>
            <DurationOptions />
          </Suspense>
        </div>
      </div>

      <TradeFormController isLandscape={isLandscape} />

      {!isMobile && <MarketSelector />}

      <BottomSheet />
    </div>
  )
}
