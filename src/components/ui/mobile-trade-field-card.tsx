import React from "react";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/themeStore";

interface MobileTradeFieldCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const MobileTradeFieldCard = ({ children, className, onClick }: MobileTradeFieldCardProps) => {
  const { isDarkMode } = useThemeStore();

  return (
    <div 
      onClick={onClick}
      className={cn(
        "h-auto text-[var(--text-color)] rounded-lg py-2 px-4 cursor-pointer",
        { "bg-[#111827]": isDarkMode, "bg-black/[0.04]": !isDarkMode },
        className
      )}
    >
      {children}
    </div>
  );
};
