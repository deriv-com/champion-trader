import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
    ({ className, style, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("animate-pulse-bg bg-gray-200 dark:bg-gray-700", className)}
                style={
                    {
                        "--skeleton-bg-from": "rgb(229, 231, 235)",
                        "--skeleton-bg-to": "rgb(209, 213, 219)",
                        ...style,
                    } as React.CSSProperties
                }
                {...props}
            />
        );
    }
);

Skeleton.displayName = "Skeleton";
