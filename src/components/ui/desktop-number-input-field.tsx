import React from "react";
import { cn } from "@/lib/utils";

export interface DesktopNumberInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    prefix?: string;
    suffix?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    error?: boolean;
    errorMessage?: string;
}

export const DesktopNumberInputField = React.forwardRef<
    HTMLInputElement,
    DesktopNumberInputFieldProps
>(({ prefix, suffix, leftIcon, rightIcon, error, errorMessage, className, ...props }, ref) => {
    return (
        <div className="flex flex-col w-full">
            <div
                className={cn(
                    "flex items-center w-full h-[56px] px-4 gap-2",
                    "bg-theme-secondary rounded-lg border border-theme-border",
                    error && "border-red-500",
                    className
                )}
            >
                {leftIcon && <div className="flex items-center justify-center">{leftIcon}</div>}
                {prefix && (
                    <span className="font-ibm text-[0.75rem] sm:text-[1rem] font-normal leading-[1.125rem] sm:leading-7 text-theme-muted">
                        {prefix}
                    </span>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "w-full bg-transparent focus:outline-none text-center",
                        "font-ibm text-[1rem] sm:text-[1rem] font-normal leading-7 sm:leading-6",
                        "text-theme"
                    )}
                    {...props}
                />
                {suffix && (
                    <span className="font-ibm text-[0.875rem] sm:text-[0.75rem] font-normal leading-[1.25rem] sm:leading-[1.125rem] text-theme-muted">
                        {suffix}
                    </span>
                )}
                {rightIcon && <div className="flex items-center justify-center">{rightIcon}</div>}
            </div>
            {error && errorMessage && (
                <p className="text-red-500 mt-2 px-4 font-ibm text-[0.875rem] sm:text-[0.75rem] font-normal leading-[1.25rem] sm:leading-[1.125rem]">
                    {errorMessage}
                </p>
            )}
        </div>
    );
});

DesktopNumberInputField.displayName = "DesktopNumberInputField";
