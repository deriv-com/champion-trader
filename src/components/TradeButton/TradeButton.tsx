import React from "react";
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
  return (
    <Button
      className={cn(
        "flex-1 flex flex-col gap-1 py-6 h-auto text-white rounded-full",
        className
      )}
      variant="default"
    >
      <div className={cn(
        "flex items-center justify-between w-full px-6",
        title_position === "right" && "flex-row-reverse"
      )}>
        <span className="text-lg font-bold">{title}</span>
        <span className="text-sm opacity-80">{label}</span>
      </div>
      <div className={cn(
        "flex items-center justify-between w-full px-6",
        title_position === "right" && "flex-row-reverse"
      )}>
        <span className="text-lg font-semibold">{value}</span>
      </div>
    </Button>
  );
};
