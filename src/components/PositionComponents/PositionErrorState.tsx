import React from "react";

interface PositionErrorStateProps {
    error: Error | { message: string };
    className?: string;
}

export const PositionErrorState: React.FC<PositionErrorStateProps> = ({
    error,
    className = "flex items-center justify-center",
}) => {
    return (
        <div className={className}>
            <p className="text-red-500">Error loading positions: {error.message}</p>
        </div>
    );
};
