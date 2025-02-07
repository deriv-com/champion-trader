import React, { Suspense } from "react"
import { useOrientationStore } from "@/stores/orientationStore"
import { TradeButton } from "@/components/TradeButton"
import { Chart } from "@/components/Chart"
import { BalanceDisplay } from "@/components/BalanceDisplay"
import { MarketSelectorButton } from "@/components/MarketSelector"
import { BottomSheet } from "@/components/BottomSheet"
import { DurationOptions } from "@/components/DurationOptions"
import { useTradeStore } from "@/stores/tradeStore"
import { useBottomSheetStore } from "@/stores/bottomSheetStore"
import TradeParam from "@/components/TradeFields/TradeParam"
import ToggleButton from "@/components/TradeFields/ToggleButton"


export const TradePage: React.FC = () => {
  const { stake, duration, allowEquals, toggleAllowEquals, symbol } = useTradeStore()
  const { setBottomSheet } = useBottomSheetStore()
  const { isLandscape } = useOrientationStore()

  const handleStakeClick = () => {
    setBottomSheet(true, 'stake');
  };
  
  const handleDurationClick = () => {
    setBottomSheet(true, 'duration', '470px');
  };

  return (
    <div className="flex flex-col flex-1 landscape:flex-row landscape:h-[100dvh] h-[100dvh] landscape:relative">
      <div
        className="hidden landscape:block landscape:absolute landscape:top-0 landscape:left-0 landscape:right-0 landscape:bg-white landscape:z-10 border-b border-opacity-10"
        id="instrument-tab-bar"
      >
        <div className="flex items-center w-full justify-between">
          <MarketSelectorButton symbol={symbol} price="968.16" />
          <div className="hidden landscape:block">
            <BalanceDisplay />
          </div>
        </div>

      </div>

      <div className="flex flex-col flex-1 landscape:w-[60%] landscape:min-w-0">
        <div className="flex items-center w-full justify-between landscape:hidden">
          <MarketSelectorButton symbol={symbol} price="968.16" />
        </div>

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
        <div className={`flex flex-col gap-4 p-4 ${isLandscape ? 'pt-4 pb-2 px-4' : ''}`} id="trade-fields">
          <div className={`flex ${isLandscape ? 'flex-col gap-2' : 'gap-4'}`} id="trade-params">
            <TradeParam 
              label="Duration" 
              value={duration} 
              className={isLandscape ? 'w-full' : ''} 
              onClick={handleDurationClick}
            />
            <TradeParam 
              label="Stake" 
              value={stake} 
              className={isLandscape ? 'w-full' : ''} 
              onClick={handleStakeClick} 
            />
          </div>

          <div id="trade-toggles" className={isLandscape ? 'mt-2' : ''}>
            <ToggleButton
              label="Allow equals"
              value={allowEquals}
              onChange={toggleAllowEquals}
            />
          </div>
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
