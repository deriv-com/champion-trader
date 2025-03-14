import React from "react";
import { cn } from "@/lib/utils";

interface BottomSheetHeaderProps {
    title: string;
    className?: string;
}

export const BottomSheetHeader: React.FC<BottomSheetHeaderProps> = ({ title, className }) => {
    return (
        <h5
            className={cn(
                "font-ubuntu text-[16px] font-bold leading-[24px] text-center py-4 px-2 text-theme",
                className
            )}
        >
            {title}
        </h5>
    );
};
