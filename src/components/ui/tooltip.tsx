import React, { useEffect, useRef } from "react";
import { useTooltipStore } from "@/stores/tooltipStore";
import { cn } from "@/lib/utils";

export const Tooltip = () => {
  const { message, isVisible, position, type, hideTooltip } = useTooltipStore();
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        hideTooltip();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [hideTooltip]);

  if (!isVisible) return null;

  const tooltipStyles = {
    position: "fixed" as const,
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: "translate(-100%, -50%)",
    marginLeft: "-16px",
  };

  return (
    <div
      ref={tooltipRef}
      style={tooltipStyles}
      className={cn(
        "z-50 px-4 py-2 rounded-lg shadow-lg whitespace-nowrap font-ibm-plex text-xs leading-[18px] font-normal",
        "after:content-[''] after:absolute after:top-1/2 after:-right-2",
        "after:w-4 after:h-4 after:-translate-y-1/2 after:rotate-45",
        {
          "bg-text-error text-white after:bg-text-error": type === "error",
          "bg-primary text-white after:bg-primary": type === "info",
          "bg-yellow-500 text-white after:bg-yellow-500": type === "warning",
          "bg-green-500 text-white after:bg-green-500": type === "success",
        }
      )}
    >
      {message}
    </div>
  );
};
