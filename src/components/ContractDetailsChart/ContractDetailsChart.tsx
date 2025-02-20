import React, { useRef, useMemo } from "react";
import { SmartChart } from "@/components/Chart/SmartChart";
import { useChartData } from "@/hooks/useChartData";
import { generateHistoricalTicks } from "@/utils/generateHistoricalData";
import { transformTickData } from "@/utils/transformChartData";

export const ContractDetailsChart: React.FC = () => {
  const ref = useRef<{
    hasPredictionIndicators(): void;
    triggerPopup(arg: () => void): void;
  }>(null);

  const historicalData = useMemo(() => {
    const data = generateHistoricalTicks("1HZ100V", 100);
    return transformTickData(data);
  }, []);

  const streamingData = useChartData({
    useMockData: true,
    instrumentId: "1HZ100V",
    type: "tick",
    durationInSeconds: 0,
  });

  return (
    <div className="h-[400px] relative bg-white shadow-md rounded-lg">
      <div className="absolute inset-0">
        <SmartChart
          ref={ref}
          id="replay-chart"
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
          granularity={0}
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
          chartType="line"
          ticksHistory={historicalData}
          streamingData={streamingData}
        />
      </div>
    </div>
  );
};
