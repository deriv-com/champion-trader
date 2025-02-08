import React from "react";
import { useOrientationStore } from "@/stores/orientationStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WebSocketError } from "@/services/api/websocket/types";
import * as Tooltip from "@radix-ui/react-tooltip";

interface TradeButtonProps {
  title: string;
  label: string;
  value: string;
  title_position?: "left" | "right";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  error?: Event | WebSocketError | null;
}

export const TradeButton: React.FC<TradeButtonProps> = ({
  title,
  label,
  value,
  title_position = "left",
  className,
  onClick,
  disabled,
  error,
}) => {
  const { isLandscape } = useOrientationStore();
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button
        className={cn(
          "flex-1 flex flex-col gap-1 text-white rounded-full",
          isLandscape ? "py-4 h-12" : "py-6 h-16",
          className
        )}
        variant="default"
        onClick={onClick}
        disabled={disabled}
      >
        <div
          className={cn(
            "flex items-center w-full px-3",
            !isLandscape
              ? title_position === "right"
                ? "justify-end"
                : "justify-between"
              : "justify-between"
          )}
        >
          <span
            className={cn("font-bold", isLandscape ? "text-base" : "text-lg")}
          >
            {title}
          </span>
        </div>
        <div
          className={cn(
            "flex items-center w-full px-3",
            !isLandscape
              ? title_position === "right"
                ? "justify-between"
                : "justify-between flex-row-reverse"
              : "justify-between"
          )}
        >
          <span
            className={cn("opacity-80", isLandscape ? "text-xs" : "text-sm")}
          >
            {label}
          </span>
          <span className={isLandscape ? "text-xs" : "text-sm"}>{value}</span>
        </div>
          </Button>
        </Tooltip.Trigger>
        {error && (
          <Tooltip.Portal>
            <Tooltip.Content
              className="bg-black/90 shadow-lg text-white px-3 py-2 rounded text-xs max-w-[200px] z-[999] animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
              side="bottom"
              sideOffset={8}
              align="center"
            >
              {error instanceof Event ? "Failed to get price" : error?.error || "Failed to get price"}
              <Tooltip.Arrow className="fill-black/90" />
            </Tooltip.Content>
          </Tooltip.Portal>
        )}
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
