import React from "react";
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
  const isRiseButton = title_position === "left";

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
        isLandscape ? "justify-start" : isRiseButton ? "justify-start" : "justify-end"
      )}>
        <span className={cn("font-bold", isLandscape ? "text-base" : "text-lg")}>{title}</span>
      </div>
      <div className="flex items-center justify-between w-full px-3">
        {(isLandscape || isRiseButton) ? (
          <>
            <span className="text-xs">{value}</span>
            <span className="text-xs opacity-80">{label}</span>
          </>
        ) : (
          <>
            <span className="text-xs opacity-80">{label}</span>
            <span className="text-xs">{value}</span>
          </>
        )}
      </div>
    </Button>
  );
};
