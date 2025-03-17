import React from "react";
import TradeParam from "@/components/TradeFields/TradeParam";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useOrientationStore } from "@/stores/orientationStore";
import { DesktopTradeFieldCard } from "@/components/ui/desktop-trade-field-card";
import { MobileTradeFieldCard } from "@/components/ui/mobile-trade-field-card";
import { useStakeField } from "./hooks/useStakeField";

interface StakeFieldProps {
    className?: string;
    // Value props
    stake: string;
    setStake: (value: string) => void;
    // Config props
    productConfig: any;
    currency: string;
    // Optional UI state props
    isConfigLoading?: boolean;
    // Optional handlers that can be overridden
    onIncrement?: () => void;
    onDecrement?: () => void;
    onMobileClick?: () => void;
    // Error handler callback
    handleError?: (hasError: boolean, errorMessage: string | null) => void;
}

export const StakeField: React.FC<StakeFieldProps> = ({
    className,
    stake,
    setStake,
    productConfig,
    currency,
    isConfigLoading = false,
    onIncrement,
    onDecrement,
    onMobileClick,
    handleError,
}) => {
    const { isLandscape } = useOrientationStore();

    // Use the hook to get all the state and handlers
    const {
        isStakeSelected,
        error,
        errorMessage,
        localValue,
        inputRef,
        containerRef,
        handleSelect,
        handleChange,
        defaultHandleIncrement,
        defaultHandleDecrement,
        defaultHandleMobileClick,
    } = useStakeField({
        stake,
        setStake,
        productConfig,
        currency,
        handleError,
    });

    // Use provided handlers or defaults
    const handleIncrement = onIncrement || defaultHandleIncrement;
    const handleDecrement = onDecrement || defaultHandleDecrement;
    const handleMobileClick = onMobileClick || defaultHandleMobileClick;

    if (isConfigLoading) {
        return (
            <div className={`${className} relative`}>
                <div
                    data-testid="stake-field-skeleton"
                    className="h-[66px] bg-theme-secondary rounded relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent"
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
                            error ? "bg-[rgba(230,25,14,0.08)]" : "bg-theme-secondary",
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
        <div className="bg-theme-bg rounded-lg">
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
                            <span className="text-left font-ibm-plex text-xs leading-[18px] font-normal text-theme-muted">
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
                                        className="text-left font-ibm-plex text-base leading-6 font-normal bg-transparent w-24 outline-none text-theme"
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
                                        className="flex items-center justify-center text-2xl text-theme"
                                        onClick={handleDecrement}
                                        aria-label="Decrease stake"
                                    >
                                        −
                                    </button>
                                </div>
                                <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                                    <button
                                        className="flex items-center justify-center text-2xl text-theme"
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
