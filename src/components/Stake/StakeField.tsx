import React, { useState, useRef, useEffect } from "react";
import TradeParam from "@/components/TradeFields/TradeParam";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useOrientationStore } from "@/stores/orientationStore";
import { DesktopTradeFieldCard } from "@/components/ui/desktop-trade-field-card";
import { MobileTradeFieldCard } from "@/components/ui/mobile-trade-field-card";
import { validateStake } from "./utils/validation";
import { incrementStake, decrementStake, parseStakeAmount } from "@/utils/stake";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { useTooltipStore } from "@/stores/tooltipStore";

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
    const { setBottomSheet } = useBottomSheetStore();
    const { showTooltip, hideTooltip } = useTooltipStore();

    // Internal state
    const [isStakeSelected, setIsStakeSelected] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>();
    const [localValue, setLocalValue] = useState(stake);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Update local value when stake prop changes
    useEffect(() => {
        setLocalValue(stake);
    }, [stake]);

    const showError = (message: string) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            showTooltip(message, { x: rect.left - 8, y: rect.top + rect.height / 2 }, "error");
        }
    };

    const validateAndUpdateStake = (value: string) => {
        if (!productConfig) return false;

        const amount = parseStakeAmount(value || "0");

        // Use values from productConfig
        const minStake = parseFloat(productConfig.data.validations.stake.min);
        const maxStake = parseFloat(productConfig.data.validations.stake.max);

        const validation = validateStake({
            amount,
            minStake,
            maxStake,
            currency,
        });

        setError(validation.error);
        setErrorMessage(validation.message);

        // Call handleError callback if provided
        if (handleError) {
            handleError(validation.error, validation.error ? validation.message || null : null);
        }

        if (validation.error && validation.message) {
            showError(validation.message);
        }

        return !validation.error;
    };

    // Default handlers that can be overridden by props
    const defaultHandleIncrement = () => {
        if (!productConfig) return;

        const newValue = incrementStake(stake || "0");
        if (validateAndUpdateStake(newValue)) {
            setStake(newValue);
            hideTooltip();
        }
    };

    const defaultHandleDecrement = () => {
        if (!productConfig) return;

        const newValue = decrementStake(stake || "0");
        if (validateAndUpdateStake(newValue)) {
            setStake(newValue);
            hideTooltip();
        }
    };

    const defaultHandleMobileClick = () => {
        if (!productConfig) return;
        setBottomSheet(true, "stake", "400px");
    };

    // Use provided handlers or defaults
    const handleIncrement = onIncrement || defaultHandleIncrement;
    const handleDecrement = onDecrement || defaultHandleDecrement;
    const handleMobileClick = onMobileClick || defaultHandleMobileClick;

    const handleSelect = (selected: boolean) => {
        if (!productConfig) return;

        setIsStakeSelected(selected);

        // Show error tooltip if there's an error
        if (error && errorMessage) {
            showError(errorMessage);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!productConfig) return;

        // Get cursor position before update
        const cursorPosition = e.target.selectionStart;

        // Extract only the number part
        let value = e.target.value;

        // If backspace was pressed and we're at the currency part, ignore it
        if (value.length < localValue.length && value.endsWith(currency)) {
            return;
        }

        // Remove currency and any non-numeric characters except decimal point
        value = value.replace(new RegExp(`\\s*${currency}$`), "").trim();
        value = value.replace(/[^\d.]/g, "");

        // Ensure only one decimal point
        const parts = value.split(".");
        if (parts.length > 2) {
            value = parts[0] + "." + parts.slice(1).join("");
        }

        // Remove leading zeros unless it's just "0"
        if (value !== "0") {
            value = value.replace(/^0+/, "");
        }

        // If it starts with a decimal, add leading zero
        if (value.startsWith(".")) {
            value = "0" + value;
        }

        setLocalValue(value);

        if (value === "") {
            setError(true);
            const message = "Please enter an amount";
            setErrorMessage(message);
            showError(message);
            setStake("");

            // Call handleError callback if provided
            if (handleError) {
                handleError(true, message);
            }

            return;
        }

        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            if (validateAndUpdateStake(value)) {
                setStake(value);
                hideTooltip();
            }

            // Restore cursor position after React updates the input
            setTimeout(() => {
                if (inputRef.current && cursorPosition !== null) {
                    inputRef.current.selectionStart = cursorPosition;
                    inputRef.current.selectionEnd = cursorPosition;
                }
            }, 0);
        }
    };

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
