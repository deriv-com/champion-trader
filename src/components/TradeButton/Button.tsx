import React from "react";

interface TradeButtonProps {
    className?: string;
    title: string;
    label: string;
    value: string;
    title_position: "left" | "right";
    onClick?: () => void;
}

export const TradeButton: React.FC<TradeButtonProps> = ({
    className = "",
    title,
    label,
    value,
    title_position,
    onClick,
}) => {
    const isLeft = title_position === "left";

    return (
        <button
            type="button"
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick && onClick();
                }
            }}
            className={`flex items-center justify-between w-full px-6 py-4 rounded-full ${className}`}
            aria-label={`${title} - ${label}: ${value}`}
        >
            {isLeft ? (
                <>
                    <div className="flex flex-col items-start">
                        <span className="text-xl font-bold text-white">{title}</span>
                        <span className="text-sm text-white/80">{label}</span>
                    </div>
                    <span className="text-xl font-bold text-white">{value}</span>
                </>
            ) : (
                <>
                    <span className="text-xl font-bold text-white">{value}</span>
                    <div className="flex flex-col items-end">
                        <span className="text-xl font-bold text-white">{title}</span>
                        <span className="text-sm text-white/80">{label}</span>
                    </div>
                </>
            )}
        </button>
    );
};
