import React from "react";
import { cn } from "@/lib/utils";

interface DesktopTradeFieldCardProps {
    children: React.ReactNode;
    className?: string;
    isSelected?: boolean;
    error?: boolean;
}

export const DesktopTradeFieldCard = ({
    children,
    className,
    isSelected,
    error,
}: DesktopTradeFieldCardProps) => {
    return (
        <div
            className={cn(
                "bg-theme-secondary rounded-lg p-2 border border-transparent",
                isSelected && "border-theme-button",
                error && "border-red-500 bg-[rgba(230,25,14,0.08)]",
                className
            )}
        >
            {children}
        </div>
    );
};
