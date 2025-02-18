import React from "react";
import { cn } from "@/lib/utils";

interface DesktopTradeFieldCardProps {
  children: React.ReactNode;
  className?: string;
}

export const DesktopTradeFieldCard = ({ children, className }: DesktopTradeFieldCardProps) => {
  return (
    <div 
      className={cn(
        "bg-[var(--background-color)] text-[var(--text-color)] rounded-lg p-2 px-4",
        className
      )}
    >
      {children}
    </div>
  );
};
