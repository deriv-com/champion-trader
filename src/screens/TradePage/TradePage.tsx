import React, { Suspense, lazy } from "react"
import { useOrientationStore } from "@/stores/orientationStore"
import { BalanceDisplay } from "@/components/BalanceDisplay"
import { BottomSheet } from "@/components/BottomSheet"
import { AddMarketButton } from "@/components/AddMarketButton"
import { DurationOptions } from "@/components/DurationOptions"
import { Card, CardContent } from "@/components/ui/card"
import { TradeFormController } from "./components/TradeFormController"


const Chart = lazy(() =>
  import("@/components/Chart").then((module) => ({
    default: module.Chart,
  }))
);

interface MarketInfoProps {
  title: string
  subtitle: string
}

const MarketInfo: React.FC<MarketInfoProps> = ({ title, subtitle }) => (
  <Card className="flex-1 min-w-[180px]" data-id="market-info">
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
  
  return (
    <div className={`flex ${isLandscape ? 'flex-row relative' : 'flex-col'} flex-1 h-[100dvh]`} data-testid="trade-page">
      {isLandscape && (
        <div
          className="absolute top-0 left-0 right-0 bg-white z-10 border-b border-opacity-10"
          id="instrument-tab-bar"
        >
          <div className="flex items-center w-full gap-2 px-4 py-2 justify-between">
            <div className="flex items-center gap-2">
              <Suspense fallback={<div>Loading...</div>}>
                <AddMarketButton />
              </Suspense>
              <MarketInfo title="Vol. 100 (1s) Index" subtitle="Rise/Fall" />
            </div>
            <BalanceDisplay />
          </div>
        </div>
      )}

      <div className={`flex flex-col flex-1 ${isLandscape ? 'w-[70%] min-w-0' : ''} overflow-hidden`}>
        {!isLandscape && (
          <div className="flex items-center w-full gap-2 p-4 justify-between">
            <div className="flex items-center gap-2">
              <Suspense fallback={<div>Loading...</div>}>
                <AddMarketButton />
              </Suspense>
              <MarketInfo title="Vol. 100 (1s) Index" subtitle="Rise/Fall" />
            </div>
          </div>
        )}

        <div className="flex flex-col flex-1 min-h-0">
          <div className={`flex-1 relative ${isLandscape ? 'mt-[78px]' : ''}`}>
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

      <BottomSheet />
    </div>
  )
}
