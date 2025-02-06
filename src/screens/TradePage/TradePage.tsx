import React, { Suspense } from "react"
import { useOrientationStore } from "@/stores/orientationStore"
import { TradeButton } from "@/components/TradeButton"
import { Chart } from "@/components/Chart"
import { BalanceDisplay } from "@/components/BalanceDisplay"
import { BottomSheet } from "@/components/BottomSheet"
import { AddMarketButton } from "@/components/AddMarketButton"
import { DurationOptions } from "@/components/DurationOptions"
import { DurationField } from "@/components/Duration"
import { useTradeStore } from "@/stores/tradeStore"
import { useBottomSheetStore } from "@/stores/bottomSheetStore"
import { Card, CardContent } from "@/components/ui/card"
import { TradeParam, TradeFieldCard } from "@/components/TradeFields"
import ToggleButton from "@/components/TradeFields/ToggleButton"

interface MarketInfoProps {
  title: string
  subtitle: string
}

const MarketInfo: React.FC<MarketInfoProps> = ({ title, subtitle }) => (
  <Card className="flex-1 min-w-[180px]">
    <CardContent className="flex items-center gap-3 p-3">
      <div className="min-w-0">
        <div className="text-sm font-bold text-gray-700">{title}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </div>
    </CardContent>
  </Card>
)

export const TradePage: React.FC = () => {
  const { stake, allowEquals, toggleAllowEquals } = useTradeStore()
  const { setBottomSheet } = useBottomSheetStore()
  const { isLandscape } = useOrientationStore()

  const handleStakeClick = () => {
    setBottomSheet(true, 'stake');
  };
  
  return (
    <div className={`flex ${isLandscape ? 'flex-row relative' : 'flex-col'} flex-1 h-[100dvh]`}>
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

      <div className={`flex flex-col flex-1 ${isLandscape ? 'w-[70%] min-w-0' : ''}`}>
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

        <div className={`flex flex-col flex-1 ${isLandscape ? 'mt-[72px] h-[calc(100dvh-72px)]' : 'h-[calc(100dvh-200px)]'}`}>
          <Suspense fallback={<div>Loading...</div>}>
            <Chart className="flex-1" />
          </Suspense>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <DurationOptions />
        </Suspense>
      </div>

      <div 
        id="trade-section" 
        className={`${isLandscape ? 'w-[30%] min-w-[260px] max-w-[360px] flex flex-col justify-center mt-[78px] border-l border-gray-300 border-opacity-20' : ''}`}
      >
        <div id="trade-fields">
          {isLandscape ? (
            // Desktop layout
            <div className="flex flex-col gap-4 pt-4 pb-2 px-4">
              <div className="flex flex-col gap-2">
                <DurationField className="w-full" />
                <TradeParam 
                  label="Stake" 
                  value={stake} 
                  className="w-full"
                  onClick={handleStakeClick} 
                />
              </div>
              <div className="mt-2">
                <ToggleButton
                  label="Allow equals"
                  value={allowEquals}
                  onChange={toggleAllowEquals}
                />
              </div>
            </div>
          ) : (
            // Mobile layout
            <div className="p-4">
              <div className="flex flex-wrap gap-4">
                <TradeFieldCard>
                  <DurationField />
                </TradeFieldCard>
                <TradeFieldCard>
                  <TradeParam 
                    label="Stake" 
                    value={stake}
                    onClick={handleStakeClick} 
                  />
                </TradeFieldCard>
              </div>
              <div className="mt-4">
                <ToggleButton
                  label="Allow equals"
                  value={allowEquals}
                  onChange={toggleAllowEquals}
                />
              </div>
            </div>
          )}
        </div>

        <div className={`flex ${isLandscape ? 'flex-col py-2' : ''} gap-2 p-4`} id="trade-buttons">
          <Suspense fallback={<div>Loading...</div>}>
            <TradeButton
              className={`bg-emerald-500 hover:bg-emerald-600 rounded-full ${
                isLandscape ? 'h-[48px] py-3 [&>div]:px-2 [&_span]:text-sm' : ''
              }`}
              title="Rise"
              label="Payout"
              value="19.55 USD"
              title_position="right"
            />
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <TradeButton
              className={`bg-rose-500 hover:bg-rose-600 rounded-full ${
                isLandscape ? 'h-[48px] py-3 [&>div]:px-2 [&_span]:text-sm' : ''
              }`}
              title="Fall"
              label="Payout"
              value="19.55 USD"
              title_position="left"
            />
          </Suspense>
        </div>
      </div>

      <BottomSheet />
    </div>
  )
}
