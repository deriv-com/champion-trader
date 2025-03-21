import React, { ReactNode } from "react";
import { StandaloneBriefcaseFillIcon } from "@deriv/quill-icons";

interface PositionEmptyStateProps {
    icon?: ReactNode;
    positionType: string; // "open" or "closed"
    className?: string;
}

export const PositionEmptyState: React.FC<PositionEmptyStateProps> = ({
    icon = <StandaloneBriefcaseFillIcon fill="#D1D5DB" iconSize="2xl" />,
    positionType,
    className = "flex items-center justify-center",
}) => {
    return (
        <div className={className}>
            <div className="text-center">
                <div className="text-gray-400 mb-4 flex justify-center">{icon}</div>
                <h3 className="text-lg font-semibold text-theme-muted mb-2">
                    No {positionType} positions
                </h3>
                <p className="text-theme-muted text-sm">
                    Your {positionType} positions will appear here.
                </p>
            </div>
        </div>
    );
};
