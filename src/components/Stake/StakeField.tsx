import React from "react";
import TradeParam from "@/components/TradeFields/TradeParam";
import { Tooltip } from "@/components/ui/tooltip";
import { useStakeField } from "./hooks/useStakeField";
import { cn } from "@/lib/utils";
import { useOrientationStore } from "@/stores/orientationStore";

interface StakeFieldProps {
  className?: string;
  onSelect?: (isSelected: boolean) => void;
  onError?: (error: boolean) => void;
}

export const StakeField: React.FC<StakeFieldProps> = ({
  className,
  onSelect,
  onError,
}) => {
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
  } = useStakeField({ onSelect, onError });

  if (!isLandscape) {
    return (
      <div className="flex flex-col">
        <div
          className={cn(
            error ? "bg-[rgba(230,25,14,0.08)]" : "bg-[rgba(246,247,248,1)]",
            "rounded-lg"
          )}
        >
          <TradeParam
            label="Stake"
            value={`${stake} ${currency}`}
            onClick={handleMobileClick}
            className={className}
          />
        </div>
        {error && errorMessage && (
          <div className="mt-1 px-2">
            <span className="font-ibm-plex text-xs leading-[18px] font-normal text-[var(--error-color)]">
              {errorMessage}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col ${className}`}
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
            <input
              ref={inputRef}
              type="text"
              value={`${localValue}`}
              onChange={handleChange}
              onFocus={() => handleSelect(true)}
              className="text-left font-ibm-plex text-base leading-6 font-normal bg-transparent w-24 outline-none text-black dark:text-white"
              aria-label="Stake amount"
            />
          </div>
        </div>
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
      </div>
      <Tooltip />
    </div>
  );
};
