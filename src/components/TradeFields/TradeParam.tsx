import React from "react";
import { formatDurationDisplay } from "@/utils/duration";
interface TradeParamProps {
    label: string;
    value: string;
    onClick?: () => void;
    className?: string;
}

const TradeParam: React.FC<TradeParamProps> = ({ label, value, onClick, className }) => {
    const formattedValue = label === "Duration" ? formatDurationDisplay(value) : value;

    const labelClasses =
        "text-left font-ibm-plex text-xs leading-[18px] font-normal text-theme-muted";
    const valueClasses = "text-left font-ibm-plex text-base leading-6 font-normal text-theme";

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onClick();
                    }
                }}
                className={`${className} text-start`}
                aria-label={`${label}: ${value}`}
            >
                <span className={labelClasses}>{label}</span>
                <div className="text-left">
                    {typeof formattedValue === "string" ? (
                        <span className={valueClasses}>{formattedValue}</span>
                    ) : (
                        formattedValue
                    )}
                </div>
            </button>
        );
    }

    return (
        <div className={`${className} text-start`}>
            <span className={labelClasses}>{label}</span>
            <div className="text-left">
                {typeof formattedValue === "string" ? (
                    <span className={valueClasses}>{formattedValue}</span>
                ) : (
                    formattedValue
                )}
            </div>
        </div>
    );
};

export default TradeParam;
