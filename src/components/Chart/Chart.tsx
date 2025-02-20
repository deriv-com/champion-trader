import React, { useRef, useMemo } from "react";
import { SmartChart } from "./SmartChart";
import { useChartData } from "@/hooks/useChartData";
import { generateHistoricalCandles } from "@/utils/generateHistoricalData";
import { transformCandleData } from "@/utils/transformChartData";

export const TradeChart: React.FC = () => {
  const ref = useRef<{
    hasPredictionIndicators(): void;
    triggerPopup(arg: () => void): void;
  }>(null);

  const historicalData = useMemo(() => {
    const data = generateHistoricalCandles(100, 60);
    return transformCandleData(data);
  }, []);

  // const historicalData = useMemo(() => {
  //   const data = generateHistoricalTicks('1HZ100V', 100);
  //   return transformTickData(data);
  // }, []);

  const streamingData = useChartData({ 
    useMockData: true,
    instrumentId: '1HZ100V',
    type: 'candle',
    durationInSeconds: 60
  });

  // const streamingData = useChartData({ 
  //   useMockData: true,
  //   instrumentId: '1HZ100V',
  //   type: 'tick',
  //   durationInSeconds: 0
  // });

  return (
    <div style={{ display: "flex", height: "100%", position: "relative" }}>
      <SmartChart
        ref={ref}
        id="trade-chart"
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
        ticksHistory={historicalData}
        streamingData={streamingData}
      />
    </div>
  );
};
