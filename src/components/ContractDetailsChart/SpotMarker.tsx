import React from "react";

interface SpotMarkerProps {
    x: number;
    y: number;
    price: string;
    epoch: number;
    type: "start" | "end" | "reset";
    className?: string;
}

const SpotMarker: React.FC<SpotMarkerProps> = ({ x, y, price, epoch, type, className = "" }) => {
    // Format the time from epoch
    const formatTime = (epoch: number) => {
        const date = new Date(epoch * 1000);
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    // Get the appropriate icon based on the marker type
    const getMarkerIcon = () => {
        switch (type) {
            case "start":
                return (
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                            fill="currentColor"
                        />
                        <path
                            d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z"
                            fill="currentColor"
                        />
                    </svg>
                );
            case "end":
                return (
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                            fill="currentColor"
                        />
                        <path d="M16 16H8V8H16V16Z" fill="currentColor" />
                    </svg>
                );
            case "reset":
                return (
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                            fill="currentColor"
                        />
                        <path
                            d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                            fill="currentColor"
                        />
                    </svg>
                );
            default:
                return null;
        }
    };

    // Get the appropriate class based on the marker type
    const getMarkerClass = () => {
        switch (type) {
            case "start":
                return "contract-marker-start";
            case "end":
                return "contract-marker-end";
            case "reset":
                return "contract-marker-reset";
            default:
                return "";
        }
    };

    return (
        <div
            className={`contract-marker ${getMarkerClass()} ${className}`}
            style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: "translate(-50%, -50%)",
            }}
        >
            <div className="contract-marker-circle">{getMarkerIcon()}</div>
            <div className="contract-marker-label">
                <div>{price}</div>
                <div>{formatTime(epoch)}</div>
            </div>
        </div>
    );
};

export default SpotMarker;
