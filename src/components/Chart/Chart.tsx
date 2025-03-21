import React, { useRef, useState, useEffect, Suspense } from "react";
import { SmartChart } from "./SmartChart";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import {
    handleChartApiRequest,
    handleChartSubscribe,
    handleChartForget,
    handleChartForgetStream,
} from "@/api/services/chart";
import { ToolbarWidgets } from "./Components";
import { useTradeStore } from "@/stores/tradeStore";

export const TradeChart: React.FC = () => {
    const ref = useRef<{
        hasPredictionIndicators(): void;
        triggerPopup(arg: () => void): void;
    }>(null);
    const { theme } = useMainLayoutStore();
    const { isMobile, isDesktop } = useDeviceDetection();
    const [chartType, setChartType] = useState("line"); // "line", "candles", "hollow"
    const [granularity, setGranularity] = useState(0); // 0 for tick, 60 for 1m candles, etc.
    const instrument = useTradeStore((state) => state.instrument);

    // API request handlers
    const requestAPI = (request: any) => {
        // If the request is for ticks_history, use the current instrument
        if (request.ticks_history) {
            request.ticks_history = instrument;
        }
        return handleChartApiRequest(request);
    };

    const requestSubscribe = (request: any, callback: any) => {
        // If the request is for ticks or ticks_history, use the current instrument
        if (request.ticks) {
            request.ticks = instrument;
        } else if (request.ticks_history) {
            request.ticks_history = instrument;
        }
        return handleChartSubscribe(request, callback);
    };

    const requestForget = (request: any) => {
        return handleChartForget(request);
    };

    const requestForgetStream = () => {
        return handleChartForgetStream();
    };

    // When instrument changes, forget all existing streams and force chart reload
    const [chartKey, setChartKey] = useState(instrument);
    const [isChartLoading, setIsChartLoading] = useState(false);

    useEffect(() => {
        // Set loading state
        setIsChartLoading(true);

        // Clear all existing streams
        requestForgetStream();

        // Change the key to force a complete re-render of the SmartChart component
        setChartKey(instrument);

        // Set a timeout to hide the loader after a short delay
        const loadingTimeout = setTimeout(() => {
            setIsChartLoading(false);
        }, 1500); // 1.5 seconds should be enough for most chart loads

        return () => clearTimeout(loadingTimeout);
    }, [instrument]);

    // Update chart type and granularity
    const updateChartType = (type: string) => {
        // First, forget all existing streams to ensure clean state
        requestForgetStream();

        // If switching to line chart, set granularity to 0 (ticks)
        if (type === "line") {
            setChartType(type); // Set chart type first
            setTimeout(() => {
                setGranularity(0); // Then set granularity with a small delay
            }, 50);
        }
        // If switching to candles or hollow and currently on ticks, switch to 1m candles
        else if (granularity === 0) {
            setChartType(type); // Set chart type first
            setTimeout(() => {
                setGranularity(60); // Then set granularity with a small delay
            }, 50);
        } else {
            setChartType(type);
        }
    };

    const updateGranularity = (newGranularity: number) => {
        // First, forget all existing streams to ensure clean state
        requestForgetStream();

        // If switching to ticks (granularity 0), ensure chart type is line
        if (newGranularity === 0 && chartType !== "line") {
            setGranularity(newGranularity); // Set granularity first
            setTimeout(() => {
                setChartType("line"); // Then set chart type with a small delay
            }, 50);
        } else {
            setGranularity(newGranularity);
        }
    };

    // Create a div for modal portals
    useEffect(() => {
        // Check if modal_root already exists
        if (!document.getElementById("modal_root")) {
            const modalRoot = document.createElement("div");
            modalRoot.id = "modal_root";
            document.body.appendChild(modalRoot);

            // Clean up on unmount
            return () => {
                document.body.removeChild(modalRoot);
            };
        }
    }, []);

    return (
        <div className="flex h-full relative bg-theme border-r text-gray-100">
            {isChartLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-theme bg-opacity-80">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-500 border-r-transparent"></div>
                        <p className="mt-4 text-white">Loading chart data...</p>
                    </div>
                </div>
            )}
            <Suspense
                fallback={
                    <div className="flex items-center justify-center h-full w-full">
                        <div className="text-center">
                            <div className="cq-spinner"></div>
                            <p className="mt-4">Loading chart...</p>
                        </div>
                    </div>
                }
            >
                <SmartChart
                    key={chartKey} // Add key to force re-render when instrument changes
                    ref={ref}
                    id="trade-chart"
                    symbol={instrument} // Explicitly pass the instrument as symbol
                    barriers={[]}
                    chartStatusListener={() => null}
                    crosshair={0}
                    isLive
                    chartControlsWidgets={null}
                    requestSubscribe={requestSubscribe}
                    requestAPI={requestAPI}
                    toolbarWidget={() => (
                        <ToolbarWidgets
                            position={isMobile ? "bottom" : undefined}
                            updateChartType={updateChartType}
                            updateGranularity={updateGranularity}
                        />
                    )}
                    topWidgets={() => <></>}
                    enabledNavigationWidget={isDesktop ? true : false}
                    requestForget={requestForget}
                    requestForgetStream={requestForgetStream}
                    enabledChartFooter={false}
                    granularity={granularity}
                    isVerticalScrollEnabled
                    isConnectionOpened
                    clearChart={false}
                    shouldFetchTradingTimes={false}
                    allowTickChartTypeOnly={false}
                    isMobile={isMobile}
                    yAxisMargin={{
                        top: 76,
                    }}
                    leftMargin={80}
                    chartType={chartType}
                    settings={{
                        language: "en",
                        theme: theme,
                        countdown: true,
                        assetInformation: true,
                        position: "bottom",
                    }}
                />
            </Suspense>
        </div>
    );
};
