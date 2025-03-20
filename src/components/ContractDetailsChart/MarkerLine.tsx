import React from "react";

interface MarkerLineProps {
    x?: number;
    y?: number;
    height?: number;
    width?: number;
    orientation: "horizontal" | "vertical";
    label?: string;
    className?: string;
    color?: string;
}

const MarkerLine: React.FC<MarkerLineProps> = ({
    x = 0,
    y = 0,
    height = "100%",
    width = "100%",
    orientation = "vertical",
    label,
    className = "",
    color,
}) => {
    const isVertical = orientation === "vertical";

    const lineStyle = {
        ...(isVertical
            ? {
                  left: `${x}px`,
                  top: 0,
                  height: typeof height === "number" ? `${height}px` : height,
                  width: "2px",
              }
            : {
                  left: 0,
                  top: `${y}px`,
                  width: typeof width === "number" ? `${width}px` : width,
                  height: "2px",
              }),
        backgroundColor: color,
    };

    const labelStyle = {
        ...(isVertical
            ? {
                  left: `${x}px`,
                  top: "8px",
                  transform: "translateX(-50%)",
              }
            : {
                  top: `${y}px`,
                  right: "8px",
                  transform: "translateY(-50%)",
              }),
        backgroundColor: color,
    };

    return (
        <>
            <div
                className={`contract-marker-line ${isVertical ? "vertical" : "horizontal"} ${className}`}
                style={lineStyle}
            />
            {label && (
                <div className="barrier-line-label" style={labelStyle}>
                    {label}
                </div>
            )}
        </>
    );
};

export default MarkerLine;
