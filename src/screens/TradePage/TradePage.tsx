import React, { Suspense } from "react"
import { TradeButton } from "@/components/TradeButton"
import { Chart } from "@/components/Chart"
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
    <div className="flex flex-col flex-1">
      <div
        className="flex items-center w-full gap-2 p-4"
        id="instrument-tab-bar"
      >
        <Suspense fallback={<div>Loading...</div>}>
          <AddMarketButton />
        </Suspense>
        <div className="flex flex-1 gap-2">
          <MarketInfo title="Vol. 100 (1s) Index" subtitle="Rise/Fall" />
        </div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <Chart className="flex-1" />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <DurationOptions />
      </Suspense>

      <div id="trade-section">
        <div className="flex flex-col gap-4 p-4" id="trade-fields">
          <div className="flex gap-4" id="trade-params">
            <TradeParam label="Duration" value={duration} />
            <TradeParam 
              label="Stake" 
              value={stake} 
              onClick={handleStakeClick}
            />
          </div>

          <div id="trade-toggles">
            <ToggleButton
              label="Allow equals"
              value={allowEquals}
              onChange={toggleAllowEquals}
            />
          </div>
        </div>

        <div className="flex gap-2 p-4" id="trade-buttons">
          <Suspense fallback={<div>Loading...</div>}>
            <div className="flex-1">
              <TradeButton
                className="bg-emerald-500 hover:bg-emerald-600 rounded-full w-full"
                title="Rise"
                label="Payout"
                value="19.55 USD"
                title_position="right"
              />
            </div>
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <TradeButton
              className="bg-rose-500 hover:bg-rose-600 rounded-full"
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
