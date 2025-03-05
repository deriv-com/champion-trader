import React from "react";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/themeStore";

interface DesktopTradeFieldCardProps {
  children: React.ReactNode;
  className?: string;
  isSelected?: boolean;
  error?: boolean;
}

export const DesktopTradeFieldCard = ({ children, className, isSelected, error }: DesktopTradeFieldCardProps) => {
  const { isDarkMode } = useThemeStore();
  const backgroundColor = isDarkMode ? "bg-gray-800" : "bg-gray-100";

  return (
      <div 
        className={cn(
          `${backgroundColor} text-primary rounded-lg p-2 border border-transparent`,
          isSelected && "border-primary",
          error && "border-red-500 bg-[rgba(230,25,14,0.08)]",
          className
        )}
      >
        {children}
      </div>
  );
};
