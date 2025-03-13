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
                "flex items-center h-[56px] bg-[rgba(246,247,248,1)] rounded-lg px-4 border border-transparent",
                isSelected && "border-primary",
                error && "border-red-500 bg-[rgba(230,25,14,0.08)]",
                className
            )}
        >
            {children}
        </div>
    );
};
