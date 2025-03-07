import React from "react";
import { useOfflineStore } from "@/stores/offlineStore";

export const OfflineIndicator: React.FC = () => {
    const { isOnline } = useOfflineStore();

    if (isOnline) return null;

    return (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-2 text-center z-50">
            <div className="flex items-center justify-center space-x-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
                <span>You're offline. Some features may be unavailable.</span>
            </div>
        </div>
    );
};

export default OfflineIndicator;
