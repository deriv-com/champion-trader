import React, { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { SmartChart } from "@/components/Chart/SmartChart";
import { useOrientationStore } from "@/stores/orientationStore";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import {
    handleChartApiRequest,
    handleChartSubscribe,
    handleChartForget,
    handleChartForgetStream,
} from "@/api/services/chart";
import { getContractReplayData, closeContractStream } from "@/utils/contractApi";
import { createChartMarkers } from "@/utils/chart-markers";
import "./contract-details-chart.css";

// ChartMarker component for rendering markers on the chart
const ChartMarker: React.FC<{
    marker_config: {
        ContentComponent?: React.ComponentType<any> | string;
        className?: string;
        x: string | number;
        y: string | number | null;
    };
    marker_content_props: any;
    is_positioned_behind?: boolean;
    is_positioned_before?: boolean;
}> = ({
    marker_config,
    marker_content_props,
    is_positioned_behind = false,
    is_positioned_before = false,
}) => {
    const { ContentComponent = "div", ...marker_props } = marker_config;

    // Use the FastMarker from SmartChart
    return (
        <Suspense fallback={<div>Loading marker...</div>}>
            <FastMarker
                markerRef={(ref: any) => {
                    if (ref) {
                        // NOTE: null price means vertical line.
                        if (!marker_props.y) {
                            const margin = 24; // height of line marker icon
                            ref.div.style.height = `calc(100% - ${margin}px)`;
                        } else {
                            ref.div.style.zIndex = "1";
                        }
                        if (is_positioned_behind) ref.div.style.zIndex = "-1";
                        if (is_positioned_before) ref.div.style.zIndex = "102";

                        // Set position explicitly to ensure proper placement
                        ref.setPosition({
                            epoch: +marker_props.x,
                            price: Number(marker_props.y),
                        });
                    }
                }}
                className={`chart-marker ${marker_props.className || ""}`}
            >
                {typeof ContentComponent === "string" ? (
                    <div className={marker_content_props.className || ""} />
                ) : marker_content_props.spot_className ? (
                    <SpotMarker {...marker_content_props} />
                ) : (
                    <ContentComponent {...marker_content_props} />
                )}
            </FastMarker>
        </Suspense>
    );
};

// Reset contract chart elements component
const ResetContractChartElements: React.FC<{
    contract_info: any;
}> = ({ contract_info }) => {
    const { contract_type, entry_spot, reset_time, reset_barrier } = contract_info || {};
    const is_reset_call = /CALL/i.test(contract_type || "");

    // Gradient logic: when reset_time has come, we need to reapply gradient
    // For CALL, shade will be applied to the lowest barrier, for PUT - to the highest barrier
    let y_axis_coordinates = Math.max(Number(entry_spot), Number(reset_barrier));
    if (is_reset_call) {
        y_axis_coordinates = Math.min(Number(entry_spot), Number(reset_barrier));
    }

    return (
        <>
            <ChartMarker
                is_positioned_behind
                marker_config={{
                    ContentComponent: "div",
                    x: Number(reset_time),
                    y: y_axis_coordinates,
                }}
                marker_content_props={{
                    className: `sc-barrier_gradient sc-barrier_gradient--${is_reset_call ? "to-bottom" : "to-top"}`,
                }}
            />
            <ChartMarker
                is_positioned_behind
                marker_config={{
                    ContentComponent: "div",
                    x: Number(reset_time),
                    y: Number(reset_barrier),
                }}
                marker_content_props={{ className: "sc-reset_barrier" }}
            />
        </>
    );
};

interface ContractDetailsChartProps {
    contractId?: string;
    accountId?: string;
    symbol?: string;
    startTime?: number;
    endTime?: number;
    entrySpot?: number;
    exitSpot?: number;
    barriers?: Array<{
        barrier: number;
        color: string;
        label?: string;
    }>;
    isReplay?: boolean;
    isVerticalScrollDisabled?: boolean;
    is_dark_theme?: boolean;
    is_accumulator_contract?: boolean;
    is_reset_contract?: boolean;
}

// Extended contract details interface to include additional properties
interface ExtendedContractDetails {
    [key: string]: any; // Allow any property
    is_forward_starting?: boolean;
    date_start?: number;
    is_sold?: boolean;
    reset_time?: number;
    reset_barrier?: number;
    contract_type?: string;
    purchase_time?: number;
}

export const ContractDetailsChart: React.FC<ContractDetailsChartProps> = ({
    contractId,
    accountId = "active_account_id",
    symbol = "1HZ100V",
    startTime,
    endTime,
    entrySpot,
    exitSpot,
    barriers = [],
    isReplay = true,
    isVerticalScrollDisabled = false,
    is_dark_theme = false,
    is_accumulator_contract = false,
    is_reset_contract = false,
}) => {
    const ref = useRef<{
        hasPredictionIndicators(): void;
        triggerPopup(arg: () => void): void;
    }>(null);
    const { isLandscape } = useOrientationStore();
    const { theme } = useMainLayoutStore();
    const { isMobile } = useDeviceDetection();

    const [chartType, setChartType] = useState("line");
    const [granularity, setGranularity] = useState(0);
    const [chartState, setChartState] = useState("INITIAL");
    const [isChartReady, setIsChartReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [prevStartEpoch, setPrevStartEpoch] = useState<number | undefined>(undefined);

    // Contract data state
    const [contractData, setContractData] = useState<{
        ticksHistory: any;
        contractDetails: ExtendedContractDetails;
        contractBarriers: Array<{
            barrier: number;
            color: string;
            label?: string;
        }>;
        spotMarkers: {
            entrySpot?: number;
            entrySpotTime?: number;
            exitSpot?: number;
            exitSpotTime?: number;
        };
        contractTimes: {
            startTime?: number;
            endTime?: number;
        };
        contractSymbol: string;
        allTicks?: any[];
        is_sold_before_started?: boolean;
        reset_time?: number;
        reset_barrier?: number;
        contract_type?: string;
    } | null>(null);

    // Function to process contract data and update state
    const processContractData = (data: any) => {
        // Treat contractDetails as ExtendedContractDetails to access additional properties
        const extendedDetails = data.contractDetails as unknown as ExtendedContractDetails;

        setContractData({
            ticksHistory: data.ticksHistory,
            contractDetails: extendedDetails,
            contractBarriers: data.barriers,
            spotMarkers: data.spotMarkers,
            contractTimes: data.contractTimes,
            contractSymbol: data.symbol,
            allTicks: data.allTicks,
            // Check for properties that might not exist in the standard ContractDetails interface
            is_sold_before_started:
                Boolean(extendedDetails.is_forward_starting) &&
                !Boolean(extendedDetails.date_start) &&
                Boolean(extendedDetails.is_sold),
            reset_time: extendedDetails.reset_time,
            reset_barrier: extendedDetails.reset_barrier,
            contract_type: extendedDetails.contract_type,
        });
    };

    // Set up event listener for contract updates
    useEffect(() => {
        // Function to handle contract update events
        const handleContractUpdate = (event: Event) => {
            if (event instanceof CustomEvent && event.detail) {
                try {
                    const updatedData = event.detail;

                    // Process the updated contract data
                    if (updatedData.contractDetails) {
                        processContractData(updatedData);
                    }
                } catch (error) {
                    console.error("Error handling contract update:", error);
                }
            }
        };

        // Add event listener for contract updates
        window.addEventListener("contract_update", handleContractUpdate as EventListener);

        // Clean up event listener when component unmounts
        return () => {
            window.removeEventListener("contract_update", handleContractUpdate as EventListener);
        };
    }, []);

    // Fetch contract data when contractId changes
    useEffect(() => {
        if (contractId) {
            setIsLoading(true);
            setError(null);

            getContractReplayData(contractId, accountId)
                .then((data) => {
                    processContractData(data);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching contract data:", err);
                    setError("Failed to load contract data. Please try again.");
                    setIsLoading(false);
                });
        }

        // Clean up function to close the contract stream when the component unmounts
        return () => {
            if (contractId) {
                closeContractStream(contractId);
            }
        };
    }, [contractId, accountId]);

    // Use contract data if available, otherwise use props
    const effectiveSymbol = contractData?.contractSymbol || symbol;
    const effectiveStartTime = contractData?.is_sold_before_started
        ? contractData?.contractDetails?.purchase_time
        : contractData?.contractTimes?.startTime || startTime;
    const effectiveEndTime = contractData?.contractTimes?.endTime || endTime;
    const effectiveEntrySpot = contractData?.spotMarkers?.entrySpot || entrySpot;
    const effectiveEntrySpotTime = contractData?.spotMarkers?.entrySpotTime || effectiveStartTime;
    const effectiveExitSpot = contractData?.spotMarkers?.exitSpot || exitSpot;
    const effectiveExitSpotTime = contractData?.spotMarkers?.exitSpotTime || effectiveEndTime;
    const effectiveBarriers = contractData?.contractBarriers?.length
        ? contractData.contractBarriers
        : barriers;
    const effectiveAllTicks = contractData?.allTicks || [];

    // Update prevStartEpoch when effectiveStartTime changes
    useEffect(() => {
        if (effectiveStartTime) {
            setPrevStartEpoch(effectiveStartTime);
        }
    }, [effectiveStartTime]);

    // API request handlers
    const requestAPI = (request: any) => {
        return handleChartApiRequest(request);
    };

    const requestSubscribe = (request: any, callback: any) => {
        return handleChartSubscribe(request, callback);
    };

    const requestForget = (request: any) => {
        return handleChartForget(request);
    };

    const requestForgetStream = () => {
        return handleChartForgetStream();
    };

    // Chart state change listener
    const chartStateChange = (state: string) => {
        setChartState(state);
        if (state === "READY") {
            setIsChartReady(true);
        }
    };

    // Create markers for entry and exit spots using the chart-markers utility
    const markers_array = useMemo(() => {
        if (!contractData) return [];

        const contract_info = {
            contract_id: contractId || "default",
            entry_tick: effectiveEntrySpot,
            entry_tick_time: effectiveEntrySpotTime,
            exit_tick: effectiveExitSpot,
            exit_tick_time: effectiveExitSpotTime,
            date_start: effectiveStartTime,
            date_expiry: effectiveEndTime,
            tick_stream: effectiveAllTicks,
            status: contractData?.contractDetails?.is_sold ? "sold" : "open",
            profit: contractData?.contractDetails?.profit_loss,
            contract_type: is_accumulator_contract ? "ACCU" : "VANILLA",
        };

        const markers = createChartMarkers(contract_info);
        return markers;
    }, [
        contractId,
        contractData,
        effectiveEntrySpot,
        effectiveExitSpot,
        effectiveEntrySpotTime,
        effectiveExitSpotTime,
        effectiveStartTime,
        effectiveEndTime,
        effectiveAllTicks,
        is_accumulator_contract,
    ]);

    // Format barriers for SmartChart
    const barriers_array = useMemo(() => {
        return effectiveBarriers.map((barrier, index) => ({
            shade: "none",
            shadeColor: "#F44336",
            color: barrier.color || "#F44336",
            hidePriceLines: false,
            hideBarrierLine: false,
            hideOffscreenLine: false,
            hideOffscreenBarrier: false,
            title: barrier.label || `Barrier ${index + 1}`,
            price: barrier.barrier,
        }));
    }, [effectiveBarriers]);

    // Get chart Y-axis margin
    const getChartYAxisMargin = () => {
        const chart_margin = {
            top: isMobile ? 96 : 148,
            bottom: isMobile ? 48 : 112,
        };

        if (isMobile) {
            chart_margin.bottom = 48;
            chart_margin.top = 48;
        }

        return chart_margin;
    };

    // Determine if chart should be live
    const isLive = !effectiveEndTime;

    // Determine if chart should scroll to epoch
    const allow_scroll_to_epoch = chartState === "READY" || chartState === "SCROLL_TO_LEFT";
    const scroll_to_epoch = allow_scroll_to_epoch && isReplay ? effectiveStartTime : undefined;

    // Determine if chart should be static (for accumulator contracts)
    const isStaticChart =
        !!is_accumulator_contract &&
        !!effectiveEndTime &&
        Number(effectiveStartTime) < Number(prevStartEpoch);

    // Create a div for modal portals if needed
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

    // Render chart markers
    const renderMarkers = () => {
        return markers_array.map(({ content_config, marker_config, react_key, type }) => {
            // Add ContentComponent to marker_config if it's missing
            const enhanced_marker_config = {
                ...marker_config,
                ContentComponent: marker_config.ContentComponent || "div",
            };

            return (
                <ChartMarker
                    key={react_key}
                    marker_config={enhanced_marker_config}
                    marker_content_props={content_config}
                    is_positioned_before={
                        (type === "SPOT_ENTRY" || type === "SPOT_EXIT") &&
                        effectiveBarriers.length === 2
                    }
                />
            );
        });
    };

    // Render reset contract elements if applicable
    const renderResetContractElements = () => {
        if (!is_reset_contract || !contractData?.contractDetails) return null;

        return <ResetContractChartElements contract_info={contractData.contractDetails} />;
    };

    // Loading state
    if (isLoading) {
        return (
            <div
                className={`relative bg-white shadow-md rounded-lg ${isLandscape ? "h-full" : "h-[400px]"} flex items-center justify-center`}
            >
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-500 border-r-transparent"></div>
                    <p className="mt-2">Loading contract data...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div
                className={`relative bg-white shadow-md rounded-lg ${isLandscape ? "h-full" : "h-[400px]"} flex items-center justify-center`}
            >
                <div className="text-center text-red-500">
                    <p>{error}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => {
                            if (contractId) {
                                // Close any existing streams before retrying
                                closeContractStream(contractId);

                                setIsLoading(true);
                                setError(null);

                                getContractReplayData(contractId, accountId)
                                    .then((data) => {
                                        processContractData(data);
                                        setIsLoading(false);
                                    })
                                    .catch((err) => {
                                        console.error("Error fetching contract data:", err);
                                        setError(
                                            err.message ||
                                                "Failed to load contract data. Please try again."
                                        );
                                        setIsLoading(false);
                                    });
                            }
                        }}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const settings = {
        language: "en",
        theme: is_dark_theme ? "dark" : theme,
        countdown: false,
        assetInformation: true,
        position: "bottom",
        isHighestLowestMarkerEnabled: false,
    };

    return (
        <div
            className={`relative bg-theme shadow-md rounded-lg overflow-hidden ${isLandscape ? "h-full" : "h-[400px]"}`}
        >
            <div className="absolute inset-0 rounded-lg overflow-hidden">
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
                        ref={ref}
                        id="replay-chart"
                        barriers={barriers_array}
                        chartStatusListener={(isChartReady: boolean) => {
                            setIsChartReady(isChartReady);
                        }}
                        crosshair={isMobile ? 0 : undefined}
                        isLive={isLive}
                        chartControlsWidgets={null}
                        requestSubscribe={requestSubscribe}
                        requestAPI={requestAPI}
                        toolbarWidget={() => <></>}
                        topWidgets={() => <div />}
                        enabledNavigationWidget={!isMobile}
                        requestForget={requestForget}
                        requestForgetStream={requestForgetStream}
                        enabledChartFooter={false}
                        granularity={granularity}
                        isVerticalScrollEnabled={!isVerticalScrollDisabled}
                        isConnectionOpened
                        clearChart={false}
                        shouldFetchTradingTimes={false}
                        allowTickChartTypeOnly={false}
                        isMobile={isMobile}
                        yAxisMargin={getChartYAxisMargin()}
                        leftMargin={80}
                        chartType={chartType}
                        stateChangeListener={chartStateChange}
                        startEpoch={effectiveStartTime}
                        endEpoch={effectiveEndTime}
                        scrollToEpoch={scroll_to_epoch}
                        settings={settings}
                        shouldDrawTicksFromContractInfo={true}
                        startWithDataFitMode={true}
                        anchorChartToLeft={isMobile}
                        isStaticChart={isStaticChart}
                        should_zoom_out_on_yaxis={is_accumulator_contract}
                        contracts_array={markers_array}
                        barriers_array={barriers_array}
                    >
                        {renderMarkers()}
                        {renderResetContractElements()}
                    </SmartChart>
                </Suspense>
            </div>
        </div>
    );
};

// Import FastMarker and SpotMarker at the top of the file
import { FastMarker } from "@/components/Chart/SmartChart";
import SpotMarker from "./SpotMarker";
