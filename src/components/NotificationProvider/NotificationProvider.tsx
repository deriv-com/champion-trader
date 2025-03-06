import React from "react";
import { Toaster } from "react-hot-toast";
import { useNotificationStore } from "@/stores/notificationStore";

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const config = useNotificationStore((state) => state.config);

    return (
        <>
            <Toaster
                position={config.position}
                toastOptions={{
                    duration: config.duration,
                    className: config.className,
                    style: {
                        background: "#fff",
                        color: "#363636",
                        boxShadow:
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    },
                }}
            />
            {children}
        </>
    );
};
