import React from "react";

interface PositionLoadingStateProps {
    message?: string;
    className?: string;
}

export const PositionLoadingState: React.FC<PositionLoadingStateProps> = ({
    message = "Loading positions...",
    className = "flex items-center justify-center",
}) => {
    return (
        <div className={className}>
            <p className="text-theme">{message}</p>
        </div>
    );
};
