import { useState, useRef, useEffect } from "react";
import { validateStake } from "../utils/validation";
import { incrementStake, decrementStake, parseStakeAmount } from "@/utils/stake";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { useTooltipStore } from "@/stores/tooltipStore";

interface UseStakeFieldParams {
    stake: string;
    setStake: (value: string) => void;
    productConfig: any;
    currency: string;
    handleError?: (hasError: boolean, errorMessage: string | null) => void;
}

interface UseStakeFieldResult {
    // State
    isStakeSelected: boolean;
    error: boolean;
    errorMessage?: string;
    localValue: string;
    inputRef: React.RefObject<HTMLInputElement>;
    containerRef: React.RefObject<HTMLDivElement>;

    // Handlers
    handleSelect: (selected: boolean) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    defaultHandleIncrement: () => void;
    defaultHandleDecrement: () => void;
    defaultHandleMobileClick: () => void;
    showError: (message: string) => void;
    validateAndUpdateStake: (value: string) => boolean;
}

export const useStakeField = ({
    stake,
    setStake,
    productConfig,
    currency,
    handleError,
}: UseStakeFieldParams): UseStakeFieldResult => {
    // isConfigLoading is used in the component but not in the hook
    // We're keeping it in the interface for API consistency
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

    return {
        // State
        isStakeSelected,
        error,
        errorMessage,
        localValue,
        inputRef,
        containerRef,

        // Handlers
        handleSelect,
        handleChange,
        defaultHandleIncrement,
        defaultHandleDecrement,
        defaultHandleMobileClick,
        showError,
        validateAndUpdateStake,
    };
};
