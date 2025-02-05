import React, { Suspense } from "react"
import { TradeButton } from "@/components/TradeButton"
import { Chart } from "@/components/Chart"
import { BalanceDisplay } from "@/components/BalanceDisplay"
import { BottomSheet } from "@/components/BottomSheet"
import { AddMarketButton } from "@/components/AddMarketButton"
import { DurationOptions } from "@/components/DurationOptions"
import { useTradeStore } from "@/stores/tradeStore"
import { useBottomSheetStore } from "@/stores/bottomSheetStore"
import { Card, CardContent } from "@/components/ui/card"
import TradeParam from "@/components/TradeFields/TradeParam"
import ToggleButton from "@/components/TradeFields/ToggleButton"

interface MarketInfoProps {
  title: string
  subtitle: string
}

const MarketInfo: React.FC<MarketInfoProps> = ({ title, subtitle }) => (
  <Card className="flex-1">
    <CardContent className="flex items-center gap-3 p-3">
      <div>
        <div className="text-sm font-bold text-gray-700">{title}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </div>
    </CardContent>
  </Card>
)

export const TradePage: React.FC = () => {
  const { stake, duration, allowEquals, toggleAllowEquals } = useTradeStore()
  const { setBottomSheet } = useBottomSheetStore()

  const handleStakeClick = () => {
    setBottomSheet(true, 'stake');
  };

  return (
    <div className="flex flex-col flex-1 landscape:flex-row landscape:h-[100dvh] h-[100dvh] landscape:relative">
      <div
        className="hidden landscape:block landscape:absolute landscape:top-0 landscape:left-0 landscape:right-0 landscape:bg-white landscape:z-10 border-b border-opacity-10"
        id="instrument-tab-bar"
      >
        <div className="flex items-center w-full gap-2 px-4 py-2 justify-between">
          <div className="flex items-center gap-2">
            <Suspense fallback={<div>Loading...</div>}>
              <AddMarketButton />
            </Suspense>
            <MarketInfo title="Vol. 100 (1s) Index" subtitle="Rise/Fall" />
          </div>
          <div className="hidden landscape:block">
            <BalanceDisplay />
          </div>
        </div>

      </div>

      <div className="flex flex-col flex-1 landscape:w-[60%] landscape:min-w-0">
        <div className="flex items-center w-full gap-2 p-4 justify-between landscape:hidden">
          <div className="flex items-center gap-2">
            <Suspense fallback={<div>Loading...</div>}>
              <AddMarketButton />
            </Suspense>
            <MarketInfo title="Vol. 100 (1s) Index" subtitle="Rise/Fall" />
          </div>
        </div>

        <div className="flex flex-col flex-1 landscape:mt-[72px] h-[calc(100dvh-200px)] landscape:h-[calc(100dvh-72px)]">
          <Suspense fallback={<div>Loading...</div>}>
            <Chart className="flex-1" />
          </Suspense>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <DurationOptions />
        </Suspense>
      </div>

      <div id="trade-section" className="landscape:w-[40%] landscape:min-w-[260px] landscape:max-w-[360px] landscape:flex landscape:flex-col landscape:justify-center landscape:mt-[78px] landscape:border-l landscape:border-gray-300 landscape:border-opacity-20">
        <div className="flex flex-col gap-4 p-4 landscape:pt-4 landscape:pb-2 landscape:px-4" id="trade-fields">
          <div className="flex gap-4 landscape:flex-col landscape:gap-2" id="trade-params">
        <TradeParam label="Duration" value={duration} className="landscape:w-full" />
        <TradeParam label="Stake" value={stake} className="landscape:w-full" onClick={handleStakeClick} />
          </div>

          <div id="trade-toggles" className="landscape:mt-2">
        <ToggleButton
          label="Allow equals"
          value={allowEquals}
          onChange={toggleAllowEquals}
        />
          </div>
        </div>

        <div className="flex landscape:flex-col gap-2 p-4 landscape:py-2" id="trade-buttons">
          <Suspense fallback={<div>Loading...</div>}>
        <TradeButton
          className="bg-emerald-500 hover:bg-emerald-600 rounded-full landscape:h-[52px] landscape:py-4 landscape:[&>div]:px-2 landscape:[&_span]:text-sm"
          title="Rise"
          label="Payout"
          value="19.55 USD"
          title_position="right"
        />
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
        <TradeButton
          className="bg-rose-500 hover:bg-rose-600 rounded-full landscape:h-[52px] landscape:py-4 landscape:[&>div]:px-2 landscape:[&_span]:text-sm"
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
