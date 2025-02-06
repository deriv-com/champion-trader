import React from "react";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { useOrientationStore } from "@/stores/orientationStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TradeButtonProps {
  title: string;
  label: string;
  value: string;
  title_position?: "left" | "right";
  className?: string;
}

export const TradeButton: React.FC<TradeButtonProps> = ({
  title,
  label,
  value,
  title_position = "left",
  className,
}) => {
  const { isLandscape } = useOrientationStore();
  return (
    <Button
      className={cn(
        "flex-1 flex flex-col gap-1 text-white rounded-full",
        isLandscape ? "py-4 h-12" : "py-6 h-16",
        className
      )}
      variant="default"
    >
      <div className={cn(
        "flex items-center w-full px-3",
        !isLandscape ? (title_position === "right" && "justify-end") : "justify-start"
      )}>
        <span className={cn("font-bold", isLandscape ? "text-base" : "text-lg")}>{title}</span>
      </div>
      <div className={cn(
        "flex items-center w-full px-3",
        !isLandscape ? (
          title_position === "right" ? "flex-row-reverse" : "justify-between"
        ) : "justify-between"
      )}>
        <span className={cn("opacity-80", isLandscape ? "text-xs" : "text-sm")}>{label}</span>
        <span className={isLandscape ? "text-xs" : "text-sm"}>{value}</span>
      </div>
    </Button>
  );
};
