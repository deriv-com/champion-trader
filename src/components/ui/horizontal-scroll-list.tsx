import React from "react";
import { cn } from "@/lib/utils";

interface HorizontalScrollListProps {
    children: React.ReactNode;
    className?: string;
}

export const HorizontalScrollList = ({ children, className }: HorizontalScrollListProps) => {
    return (
        <div className="w-full overflow-hidden">
            <ul
                role="list"
                className={cn(
                    "flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mb-4",
                    "scroll-smooth snap-x snap-mandatory",
                    className
                )}
            >
                {React.Children.map(children, (child) => (
                    <li className="snap-start">{child}</li>
                ))}
            </ul>
        </div>
    );
};
