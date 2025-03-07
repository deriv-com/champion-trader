import React, { useEffect, useState } from "react";

interface UpdateNotificationProps {
    registration: ServiceWorkerRegistration | null;
    onClose?: () => void;
}

export const UpdateNotification: React.FC<UpdateNotificationProps> = ({
    registration,
    onClose,
}) => {
    const [showReload, setShowReload] = useState(false);
    const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

    useEffect(() => {
        if (!registration) return;

        // When a new service worker is waiting to be activated
        const handleUpdateFound = () => {
            const newWorker = registration.installing;

            if (!newWorker) return;

            // Listen for state changes
            newWorker.addEventListener("statechange", () => {
                // When the new service worker is installed and waiting
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                    setWaitingWorker(newWorker);
                    setShowReload(true);
                }
            });
        };

        registration.addEventListener("updatefound", handleUpdateFound);

        return () => {
            registration.removeEventListener("updatefound", handleUpdateFound);
        };
    }, [registration]);

    const reloadPage = () => {
        if (!waitingWorker) return;

        // Tell waiting service worker to take control immediately
        waitingWorker.postMessage({ type: "SKIP_WAITING" });

        // Reload once the new service worker has taken control
        navigator.serviceWorker.addEventListener("controllerchange", () => {
            window.location.reload();
        });

        if (onClose) onClose();
    };

    const handleClose = () => {
        setShowReload(false);
        if (onClose) onClose();
    };

    if (!showReload) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-50">
            <div className="flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Update Available</h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    A new version of Champion Trader is available. Reload to update?
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                        Later
                    </button>
                    <button
                        onClick={reloadPage}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                        Update Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateNotification;
