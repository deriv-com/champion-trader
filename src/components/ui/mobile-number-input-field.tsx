import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface MobileNumberInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
    errorMessage?: string;
    onIncrement?: () => void;
    onDecrement?: () => void;
    prefix?: string;
}

export const MobileNumberInputField = React.forwardRef<
    HTMLInputElement,
    MobileNumberInputFieldProps
>(
    (
        {
            error,
            errorMessage,
            onIncrement,
            onDecrement,
            prefix,
            className,
            onFocus,
            onBlur,
            ...props
        },
        ref
    ) => {
        const [isSelected, setIsSelected] = useState(false);

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsSelected(true);
            onFocus?.(e);
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsSelected(false);
            onBlur?.(e);
        };

        return (
            <div className="flex flex-col w-full">
                <div
                    className={cn(
                        "flex items-center w-full h-[56px]",
                        "rounded-lg bg-theme-secondary",
                        isSelected && !error && "border border-theme",
                        error && "border border-red-500 bg-[rgba(230,25,14,0.08)]",
                        className
                    )}
                >
                    <Button
                        variant="ghost"
                        className="p-4 h-auto hover:bg-transparent"
                        onClick={onDecrement}
                        aria-label="Decrease value"
                    >
                        <span className="text-[1.125rem] text-theme">−</span>
                    </Button>
                    <div className="flex items-center justify-center w-full">
                        {prefix && (
                            <span className="font-ibm-plex text-base font-normal leading-6 text-theme-muted">
                                {prefix}
                            </span>
                        )}
                        <input
                            ref={ref}
                            className="w-full bg-transparent focus:outline-none text-center font-ibm text-[1.125rem] font-normal leading-7 text-theme"
                            inputMode="decimal"
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            {...props}
                        />
                    </div>
                    <Button
                        variant="ghost"
                        className="p-4 h-auto hover:bg-transparent"
                        onClick={onIncrement}
                        aria-label="Increase value"
                    >
                        <span className="text-[1.125rem] text-theme">+</span>
                    </Button>
                </div>
                {error && errorMessage && (
                    <p className="text-red-500 font-ibm-plex text-xs font-normal leading-[18px]">
                        {errorMessage}
                    </p>
                )}
            </div>
        );
    }
);

MobileNumberInputField.displayName = "MobileNumberInputField";
