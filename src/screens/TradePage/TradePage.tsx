import React, { Suspense, lazy } from "react"
import { useOrientationStore } from "@/stores/orientationStore"
import { BottomSheet } from "@/components/BottomSheet"
import { DurationOptions } from "@/components/DurationOptions"
import { TradeFormController } from "./components/TradeFormController"
import { useBottomSheetStore } from "@/stores/bottomSheetStore"
import { MarketSelector } from "@/components/MarketSelector"
import { useDeviceDetection } from "@/hooks/useDeviceDetection"
import { useLeftSidebarStore } from "@/stores/leftSidebarStore"
import { useMarketStore } from "@/stores/marketStore"
import { MarketInfo } from "@/components/MarketInfo"
import { BalanceDisplay } from "@/components/BalanceDisplay"

const Chart = lazy(() =>
  import("@/components/Chart").then((module) => ({
    default: module.Chart,
  }))
)

export const TradePage: React.FC = () => {
  const { isLandscape } = useOrientationStore()
  const { setBottomSheet } = useBottomSheetStore()
  const { isMobile } = useDeviceDetection()
  const selectedMarket = useMarketStore((state) => state.selectedMarket)
  const { setLeftSidebar } = useLeftSidebarStore()
  
  const handleMarketSelect = React.useCallback(() => {
    if (isMobile) {
      setBottomSheet(true, "market-info", "90%")
    } else {
      setLeftSidebar(true, "market-list")
    }
  }, [isMobile, setBottomSheet, setLeftSidebar])

  return (
    <>
      {!isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/[0.12]">
          <div className="w-full px-4 py-3 flex items-center justify-between">
            <BalanceDisplay />
          </div>
        </div>
      )}
      <div
        className={`flex ${
          isLandscape ? "flex-row relative" : "flex-col"
        } flex-1 h-[100dvh] ${!isMobile ? "pt-12" : ""}`}
        data-testid="trade-page"
      >
        <div className={`flex flex-col flex-1 ${isLandscape ? "w-[70%] min-w-0" : ""} overflow-hidden`}>
          <div className="flex flex-col flex-1 min-h-0 relative">
            {isLandscape && (
              <div className="absolute top-3 left-4 z-10">
                <MarketInfo
                  title={selectedMarket?.displayName || "Select Market"}
                  subtitle="Rise/Fall"
                  onClick={handleMarketSelect}
                  isMobile={false}
                />
              </div>
            )}
            {!isLandscape && (
              <MarketInfo
                title={selectedMarket?.displayName || "Select Market"}
                subtitle="Rise/Fall"
                onClick={handleMarketSelect}
                isMobile={true}
              />
            )}
            <div className="flex-1 relative">
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
    </>
  )
}
