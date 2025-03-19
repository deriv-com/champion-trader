import React, { useMemo } from "react";
import { SmartChart } from "@/components/Chart/SmartChart";
import { useChartData } from "@/hooks/useChartData";
import { generateHistoricalTicks } from "@/utils/generateHistoricalData";
import { transformTickData } from "@/utils/transformChartData";
import { useOrientationStore } from "@/stores/orientationStore";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import { Contract } from "@/api/services/contract/types";

interface ContractDetailsChartProps {
    contract: Contract | null;
}

export const ContractDetailsChart: React.FC<ContractDetailsChartProps> = ({ contract }) => {
    const { isLandscape } = useOrientationStore();
    const { theme } = useMainLayoutStore();
    const settings = {
        theme: theme,
    };

    // Use contract tick data if available, otherwise use mock data
    const historicalData = useMemo(() => {
        if (contract && contract.details.tick_stream && contract.details.tick_stream.length > 0) {
            // Transform contract tick stream data to the format expected by SmartChart
            return contract.details.tick_stream.map((tick) => ({
                epoch: Math.floor(tick.epoch_ms / 1000), // Convert ms to seconds
                quote: parseFloat(tick.price),
                symbol: contract.details.instrument_id,
            }));
        } else {
            // Fallback to mock data
            const data = generateHistoricalTicks("1HZ100V", 100);
            return transformTickData(data);
        }
    }, [contract]);

    // Use the contract's instrument_id if available
    const instrumentId = contract?.details.instrument_id || "1HZ100V";

    const streamingData = useChartData({
        useMockData: !contract,
        instrumentId,
        type: "tick",
        durationInSeconds: 0,
    });

    return (
        <div
            className={`relative bg-theme shadow-md rounded-lg overflow-hidden ${isLandscape ? "h-full" : "h-[400px]"}`}
        >
            <div className="absolute inset-0 rounded-lg overflow-hidden">
                <SmartChart
                    id="replay-chart"
                    barriers={[]}
                    chartStatusListener={() => {}}
                    crosshair={0}
                    isLive
                    chartControlsWidgets={null}
                    requestSubscribe={() => {}}
                    toolbarWidget={() => <></>}
                    symbol={instrumentId}
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
                    settings={settings}
                />
            </div>
        </div>
    );
};
