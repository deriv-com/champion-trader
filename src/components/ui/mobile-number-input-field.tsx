import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

export interface MobileNumberInputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  errorMessage?: string
  onIncrement?: () => void
  onDecrement?: () => void
  prefix?: string
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
            "rounded-lg bg-background-soft bg-background-dark",
            isSelected && !error && "border border-black",
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
            <span className="text-[1.125rem]">−</span>
          </Button>
          <div className="flex items-center justify-center w-full">
            {prefix && (
              <span className="font-ibm-plex text-base font-normal leading-6 text-primary text-primary">
                {prefix}
              </span>
            )}
            <input
              ref={ref}
              className="w-full bg-transparent ml-[-32px] focus:outline-none text-center font-ibm text-[1.125rem] font-normal leading-7 text-primary text-primary"
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
            <span className="text-[1.125rem]">+</span>
          </Button>
        </div>
        {error && errorMessage && (
          <p className="text-red-500 font-ibm-plex text-xs font-normal leading-[18px]">
            {errorMessage}
          </p>
        )}
      </div>
    )
  }
)

MobileNumberInputField.displayName = "MobileNumberInputField"
