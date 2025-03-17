import React from "react";
import { Contract } from "@/api/services/contract/types";

interface PositionMapperProps {
    positions: Contract[];
    positionType: "open" | "closed";
    renderPosition: (position: Contract, index: number) => React.ReactNode;
    className?: string;
    containerProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const PositionMapper: React.FC<PositionMapperProps> = ({
    positions,
    renderPosition,
    className = "",
    containerProps = {},
}) => {
    return (
        <div className={className} {...containerProps}>
            {positions.map((position, index) => renderPosition(position, index))}
        </div>
    );
};
