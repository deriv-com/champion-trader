import React from "react";

interface TradeNotificationProps {
    stake: string;
    market: string;
    type: string;
    icon?: React.ReactNode;
    onClose?: () => void;
}

export const TradeNotification: React.FC<TradeNotificationProps> = ({
    stake,
    market,
    type,
    icon,
    onClose,
}) => {
    return (
        <div className="flex items-start gap-4 bg-black text-white p-4 rounded-lg w-[320px]">
            <div className="rounded-full bg-primary/10 p-2">{icon}</div>
            <div className="flex-1">
                <div className="font-semibold text-base">{stake}</div>
                <div className="text-sm text-gray-400">
                    {type} - {market}
                </div>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose?.();
                }}
                className="text-gray-400 hover:text-white"
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M18 6L6 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M6 6L18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        </div>
    );
};
