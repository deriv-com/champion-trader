import React, { Suspense, lazy } from "react"
import { BalanceDisplay } from "@/components/BalanceDisplay"
import { BottomSheet } from "@/components/BottomSheet"
import { DurationOptions } from "@/components/DurationOptions"
import { Card, CardContent } from "@/components/ui/card"
import { useOrientationStore } from "@/stores/orientationStore";
// import { AddMarketButton } from "@/components/AddMarketButton";
import { TradeFormController } from "./components/TradeFormController";

const Chart = lazy(() =>
  import("@/components/Chart").then((module) => ({
    default: module.Chart,
  }))
);

export const TradePage: React.FC = () => {
  const { isLandscape } = useOrientationStore();

  return (
    <div
      className={`flex ${
        isLandscape ? "flex-row relative" : "flex-col"
      } flex-1 h-[100dvh]`}
      data-testid="trade-page"
    >
      <div className={`flex flex-col flex-1 overflow-hidden`}>
        <div className="flex flex-col flex-1 min-h-0">
          <div className={`flex-1 relative`}>
            <Suspense fallback={<div>Loading...</div>}>
              <Chart />
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
  );
};
