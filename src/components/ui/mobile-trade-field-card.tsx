import React from "react";
import { cn } from "@/lib/utils";

interface MobileTradeFieldCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const MobileTradeFieldCard = ({ children, className, onClick }: MobileTradeFieldCardProps) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "h-auto bg-[var(--background-color)] text-[var(--text-color)] rounded-lg py-2 px-4 cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
};
