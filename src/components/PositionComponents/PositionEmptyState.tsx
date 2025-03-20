import React, { ReactNode } from "react";
import { Briefcase } from "lucide-react";

interface PositionEmptyStateProps {
    icon?: ReactNode;
    positionType: string; // "open" or "closed"
    className?: string;
}

export const PositionEmptyState: React.FC<PositionEmptyStateProps> = ({
    icon = <Briefcase size={64} strokeWidth={1.5} />,
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
