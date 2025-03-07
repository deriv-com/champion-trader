import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface PopoverProps {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    style?: React.CSSProperties;
}

export const Popover = ({ children, isOpen, onClose, className, style }: PopoverProps) => {
    const popoverRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        // Stop event from bubbling up to window
        e.stopPropagation();
    };

    // Handle window clicks
    useEffect(() => {
        const handleWindowMouseDown = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener("mousedown", handleWindowMouseDown);
        }

        return () => {
            window.removeEventListener("mousedown", handleWindowMouseDown);
        };
    }, [isOpen, onClose]);

    return (
        <div
            ref={popoverRef}
            className={cn("absolute z-50", className)}
            style={style}
            onMouseDown={handleMouseDown}
        >
            {children}
        </div>
    );
};
