import React, { Suspense, lazy } from "react";
import { useOrientationStore } from "@/stores/orientationStore";
import { BottomSheet } from "@/components/BottomSheet";
import { DurationOptions } from "@/components/DurationOptions";
import { TradeFormController } from "./components/TradeFormController";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { MarketSelector } from "@/components/MarketSelector";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import { useMarketStore } from "@/stores/marketStore";
import { MarketInfo } from "@/components/MarketInfo";

const Chart = lazy(() =>
  import("@/components/Chart").then((module) => ({
    default: module.Chart,
  }))
);

export const TradePage: React.FC = () => {
  const { isLandscape } = useOrientationStore();
  const { setBottomSheet } = useBottomSheetStore();
  const { isMobile } = useDeviceDetection();
  const selectedMarket = useMarketStore((state) => state.selectedMarket);
  const { setOverlaySidebar, activeSidebar } = useMainLayoutStore();

  const handleMarketSelect = React.useCallback(() => {
    if (isMobile) {
      setBottomSheet(true, "market-info", "80%");
    } else {
      setOverlaySidebar(true, "market-list");
    }
  }, [isMobile, setBottomSheet, setOverlaySidebar]);

  const shouldEnableScrolling = isLandscape && window.innerHeight < 500;

  return (
    <div
      className={`flex ${
        isLandscape 
          ? `flex-row relative h-[calc(100vh-4rem)] ${shouldEnableScrolling ? "overflow-y-auto" : ""}`
          : "flex-col h-[100dvh]"
      } flex-1`}
      data-testid="trade-page"
    >
      <div
        className={`flex flex-col flex-1 ${shouldEnableScrolling ? "" : "overflow-hidden"} ${
          isLandscape ? "mb-2" : ""
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {isLandscape && (
            <div className={`absolute top-3 ${activeSidebar ? 'left-[calc(320px+16px)]' : 'left-4'} z-10 transition-all duration-300`}>
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
              <Chart />
            </Suspense>
          </div>

          {!isLandscape && (
            <Suspense fallback={<div>Loading...</div>}>
              <DurationOptions />
            </Suspense>
          )}
        </div>
      </div>

      <TradeFormController isLandscape={isLandscape} />

      {!isMobile && <MarketSelector />}

      <BottomSheet />
    </div>
  );
};
