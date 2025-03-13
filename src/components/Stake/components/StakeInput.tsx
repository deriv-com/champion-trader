import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DesktopNumberInputField } from "@/components/ui/desktop-number-input-field";
import { MobileNumberInputField } from "@/components/ui/mobile-number-input-field";
import { incrementStake, decrementStake } from "@/utils/stake";
import { useClientStore } from "@/stores/clientStore";

interface StakeInputProps {
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    isDesktop?: boolean;
    error?: boolean;
    errorMessage?: string;
    maxPayout?: number;
}

export const StakeInput: React.FC<StakeInputProps> = ({
    value,
    onChange,
    onBlur,
    isDesktop,
    error,
    errorMessage,
    maxPayout,
}) => {
    const { currency } = useClientStore();

    const handleIncrement = () => {
        onChange(incrementStake(value || "0"));
    };

    const handleDecrement = () => {
        onChange(decrementStake(value || "0"));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numericValue = e.target.value.replace(/[^0-9.]/g, "");
        const currentAmount = value ? value.split(" ")[0] : "";
        const amount = parseFloat(numericValue);

        // Only prevent adding more numbers if there's a max error
        if (
            error &&
            maxPayout &&
            amount > maxPayout &&
            e.target.value.length > currentAmount.length
        ) {
            return;
        }

        if (numericValue === "") {
            onChange("");
            return;
        }

        if (!isNaN(amount)) {
            onChange(amount.toString());
        }
    };

    const amount = value ? value.split(" ")[0] : "";

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Focus input when component mounts
        inputRef.current?.focus();
    }, []);

    return (
        <div className="flex flex-col">
            {isDesktop ? (
                <>
                    <DesktopNumberInputField
                        ref={inputRef}
                        value={amount}
                        onChange={handleChange}
                        onBlur={onBlur}
                        error={error}
                        errorMessage={errorMessage}
                        prefix={currency}
                        leftIcon={
                            <Button
                                variant="ghost"
                                className="p-0 h-auto hover:bg-transparent"
                                onClick={handleDecrement}
                                aria-label="Decrease stake"
                            >
                                <span className="text-theme text-[1.125rem] sm:text-[1rem]">−</span>
                            </Button>
                        }
                        rightIcon={
                            <Button
                                variant="ghost"
                                className="p-0 h-auto hover:bg-transparent"
                                onClick={handleIncrement}
                                aria-label="Increase stake"
                            >
                                <span className="text-theme text-[1.125rem] sm:text-[1rem]">+</span>
                            </Button>
                        }
                        type="text"
                        inputMode="decimal"
                        aria-label="Stake amount"
                    />
                </>
            ) : (
                <MobileNumberInputField
                    ref={inputRef}
                    value={amount}
                    onChange={handleChange}
                    onBlur={onBlur}
                    error={error}
                    errorMessage={errorMessage}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    type="text"
                    aria-label="Stake amount"
                    prefix={currency}
                />
            )}
        </div>
    );
};
