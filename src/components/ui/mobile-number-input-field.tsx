import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface MobileNumberInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorMessage?: string;
  onIncrement?: () => void;
  onDecrement?: () => void;
  prefix?: string;
}

export const MobileNumberInputField = React.forwardRef<HTMLInputElement, MobileNumberInputFieldProps>(
  (
    {
      error,
      errorMessage,
      onIncrement,
      onDecrement,
      prefix,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex flex-col w-full">
        <div
          className={cn(
            "flex items-center w-full h-[56px]",
            "bg-white rounded-lg border border-gray-200",
            error && "border-red-500",
            className
          )}
        >
          <Button
            variant="ghost"
            className="p-4 h-auto hover:bg-transparent"
            onClick={onDecrement}
            aria-label="Decrease value"
          >
            <span className="text-[1.125rem]">−</span>
          </Button>
          <div className="flex items-center justify-center w-full">
            {prefix && (
              <span className="font-ibm text-[0.75rem] sm:text-[1rem] font-normal leading-[1.125rem] sm:leading-7 text-black/48 mr-1">
                {prefix}
              </span>
            )}
            <input
              ref={ref}
              className="w-full bg-transparent focus:outline-none text-center font-ibm text-[1.125rem] font-normal leading-7 text-black"
              inputMode="decimal"
              {...props}
            />
          </div>
          <Button
            variant="ghost"
            className="p-4 h-auto hover:bg-transparent"
            onClick={onIncrement}
            aria-label="Increase value"
          >
            <span className="text-[1.125rem]">+</span>
          </Button>
        </div>
        {error && errorMessage && (
          <p className="text-red-500 mt-2 px-4 font-ibm text-[0.875rem] sm:text-[0.75rem] font-normal leading-[1.25rem] sm:leading-[1.125rem]">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

MobileNumberInputField.displayName = "MobileNumberInputField";
