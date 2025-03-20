import React, { Suspense, lazy } from "react";
import { useOrientationStore } from "@/stores/orientationStore";
import { BottomSheet } from "@/components/BottomSheet";
import { DurationOptions } from "@/components/DurationOptions";
import { TradeFormController } from "./components/TradeFormController";
import { MarketSelector, MarketSelectorButton } from "@/components/MarketSelector";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import { useTradeStore } from "@/stores/tradeStore";
import { TradeTypesListController } from "./components/TradeTypesListController";

const Chart = lazy(() =>
    import("@/components/Chart").then((module) => ({
        default: module.Chart,
    }))
);

export const TradePage: React.FC = () => {
    const { isLandscape } = useOrientationStore();
    const { isMobile } = useDeviceDetection();
    const { activeSidebar } = useMainLayoutStore();
    const { tradeTypeDisplayName, instrument } = useTradeStore((state) => ({
        tradeTypeDisplayName: state.tradeTypeDisplayName,
        instrument: state.instrument,
    }));

    return (
        <div
            className={`flex ${
                isLandscape ? "flex-row relative h-full py-2" : "flex-col h-[100dvh]"
            } flex-1 lg:py-4`}
            data-testid="trade-page"
        >
            <div className="flex flex-col flex-1 min-h-0 gap-2">
                <TradeTypesListController />
                <div
                    className={`relative flex flex-col flex-1 overflow-hidden ${
                        isLandscape ? "mb-2" : ""
                    }`}
                >
                    {isLandscape && (
                        <div
                            className={`absolute ${
                                activeSidebar ? "left-[calc(320px+16px)]" : "left-4"
                            } z-10 transition-all duration-300`}
                        >
                            <MarketSelectorButton
                                symbol={instrument}
                                subtitle={tradeTypeDisplayName}
                            />
                        </div>
                    )}
                    {!isLandscape && (
                        <div className="px-4">
                            <MarketSelectorButton
                                symbol={instrument}
                                subtitle={tradeTypeDisplayName}
                            />
                        </div>
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
