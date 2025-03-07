import React, { useEffect, useState } from "react";
import { register } from "../../serviceWorkerRegistration";
import PWAPrompt from "./PWAPrompt";
import UpdateNotification from "./UpdateNotification";

export const PWAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

    useEffect(() => {
        // Register service worker and handle updates
        register({
            onSuccess: (registration) => {
                console.log("Service worker registration successful");
                setRegistration(registration);
            },
            onUpdate: (registration) => {
                console.log("New content is available; please refresh.");
                setRegistration(registration);
            },
        });

        // Listen for the message from the service worker
        const handleMessage = (event: MessageEvent) => {
            if (event.data && event.data.type === "OFFLINE_READY") {
                console.log("App is ready for offline use");
            }
        };

        navigator.serviceWorker.addEventListener("message", handleMessage);

        return () => {
            navigator.serviceWorker.removeEventListener("message", handleMessage);
        };
    }, []);

    return (
        <>
            {children}
            <PWAPrompt />
            <UpdateNotification registration={registration} />
        </>
    );
};

export default PWAProvider;
