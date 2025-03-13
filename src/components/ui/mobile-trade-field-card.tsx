import React from "react";
import { cn } from "@/lib/utils";

interface MobileTradeFieldCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const MobileTradeFieldCard = ({
    children,
    className,
    onClick,
}: MobileTradeFieldCardProps) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                "h-auto bg-theme-secondary rounded-lg py-2 px-4 cursor-pointer",
                className
            )}
        >
            {children}
        </div>
    );
};
