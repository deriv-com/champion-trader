import React from "react";

interface ChipProps {
    children: React.ReactNode;
    isSelected?: boolean;
    onClick?: () => void;
}

export const Chip: React.FC<ChipProps> = ({ children, isSelected, onClick }) => {
    return (
        <button
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (onClick) onClick();
                }
            }}
            className={`h-8 min-h-[32px] max-h-[32px] px-4 py-1 rounded-full font-ibm-plex text-body transition-all whitespace-nowrap ${isSelected ? "bg-black text-white" : "bg-white text-black/60 ring-1 ring-black/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"}`}
        >
            {children}
        </button>
    );
};
