import React, { useRef } from "react";
import { SmartChart } from "./SmartChart";

export const TradeChart: React.FC = () => {
  const ref = useRef<{
    hasPredictionIndicators(): void;
    triggerPopup(arg: () => void): void;
  }>(null);

  // if (symbols.length == 0) return null
  return (
    <div style={{ display: "flex", height: "100%", position: "relative" }}>
      <SmartChart
        ref={ref}
        // id="charts"
        barriers={[]}
        chartStatusListener={(isChartReady: boolean) =>
          console.log("isChartReady", isChartReady)
        }
        crosshair={0}
        isLive
        chartControlsWidgets={null}
        requestSubscribe={() => {}}
        toolbarWidget={() => <></>}
        symbol={"R_10"}
        topWidgets={() => <div />}
        enabledNavigationWidget={false}
        requestForget={() => {}}
        requestForgetStream={() => {}}
        enabledChartFooter={false}
        granularity={60}
        isVerticalScrollEnabled
        // isConnectionOpened={wsRef.current?.OPEN}
        isConnectionOpened
        clearChart={false}
        shouldFetchTradingTimes={false}
        allowTickChartTypeOnly={false}
        feedCall={{
          activeSymbols: false,
        }}
        isMobile={false}
        yAxisMargin={{
          top: 76,
        }}
        leftMargin={80}
        chartType="candles"
      />
    </div>
  );
};
