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
                "flex h-[56px] bg-black/[0.04] rounded-lg px-4 cursor-pointer",
                className
            )}
        >
            {children}
        </div>
    );
};
