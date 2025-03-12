import React from "react";
import TradeParam from "@/components/TradeFields/TradeParam";
import { Tooltip } from "@/components/ui/tooltip";
import { useStakeField } from "./hooks/useStakeField";
import { cn } from "@/lib/utils";
import { useOrientationStore } from "@/stores/orientationStore";
import { DesktopTradeFieldCard } from "@/components/ui/desktop-trade-field-card";
import { MobileTradeFieldCard } from "@/components/ui/mobile-trade-field-card";

interface StakeFieldProps {
    className?: string;
}

export const StakeField: React.FC<StakeFieldProps> = ({ className }) => {
    const { isLandscape } = useOrientationStore();
    const {
        stake,
        currency,
        error,
        errorMessage,
        localValue,
        inputRef,
        containerRef,
        handleSelect,
        handleChange,
        handleIncrement,
        handleDecrement,
        handleMobileClick,
        isConfigLoading,
        isStakeSelected,
        productConfig,
    } = useStakeField();

    if (isConfigLoading) {
        return (
            <div className={`${className} relative`}>
                <div
                    data-testid="stake-field-skeleton"
                    className="h-[66px] bg-gray-200 rounded relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent"
                />
            </div>
        );
    }

    if (!isLandscape) {
        return (
            <MobileTradeFieldCard onClick={handleMobileClick}>
                <div className="flex flex-col">
                    <div
                        className={cn(
                            error ? "bg-[rgba(230,25,14,0.08)]" : "bg-transparent",
                            "rounded-lg"
                        )}
                    >
                        <TradeParam
                            label="Stake"
                            value={productConfig ? `${stake} ${currency}` : "N/A"}
                            onClick={handleMobileClick}
                            className={`${className} ${!productConfig ? "opacity-50 cursor-not-allowed" : ""}`}
                        />
                    </div>
                    {error && errorMessage && (
                        <div className="mt-1 px-2">
                            <span className="font-ibm-plex text-xs leading-[18px] font-normal text-red-500">
                                {errorMessage}
                            </span>
                        </div>
                    )}
                </div>
            </MobileTradeFieldCard>
        );
    }

    return (
        <div className="bg-white rounded-lg">
            <DesktopTradeFieldCard isSelected={isStakeSelected} error={error}>
                <div
                    className={`flex flex-col ${className} ${!productConfig ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => handleSelect(true)}
                    onBlur={(e) => {
                        // Only blur if we're not clicking inside the component
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                            handleSelect(false);
                        }
                    }}
                    tabIndex={0}
                >
                    <div ref={containerRef} className="flex rounded-lg h-[48px]">
                        <div className="flex flex-col flex-1 justify-between">
                            <span className="text-left font-ibm-plex text-xs leading-[18px] font-normal text-primary">
                                Stake ({currency})
                            </span>
                            <div className="relative">
                                {productConfig ? (
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={`${localValue}`}
                                        onChange={handleChange}
                                        onFocus={() => handleSelect(true)}
                                        className="text-left font-ibm-plex text-base leading-6 font-normal bg-transparent w-24 outline-none text-gray-900"
                                        aria-label="Stake amount"
                                    />
                                ) : (
                                    <span className="text-left font-ibm-plex text-base leading-6 font-normal text-gray-900">
                                        N/A
                                    </span>
                                )}
                            </div>
                        </div>
                        {productConfig && (
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                                    <button
                                        className="flex items-center justify-center text-2xl"
                                        onClick={handleDecrement}
                                        aria-label="Decrease stake"
                                    >
                                        −
                                    </button>
                                </div>
                                <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                                    <button
                                        className="flex items-center justify-center text-2xl"
                                        onClick={handleIncrement}
                                        aria-label="Increase stake"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <Tooltip />
                </div>
            </DesktopTradeFieldCard>
        </div>
    );
};
