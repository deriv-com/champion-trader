import { useState, useEffect, useRef } from "react";

/**
 * A hook for subscribing to SSE events
 * @template T The type of data received from the subscription
 * @param subscribe A function that sets up the subscription and returns an unsubscribe function
 * @param deps Dependencies array that will trigger resubscription when changed
 * @returns An object with the latest data, any error, and a flag indicating if a connection is being established
 */
export const useSSESubscription = <T>(
    subscribe: (onData: (data: T) => void, onError: (error: any) => void) => () => void,
    deps: any[] = []
) => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const unsubscribeRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        // Set connecting state to true when starting a new subscription
        setIsConnecting(true);

        const unsubscribe = subscribe(
            (newData) => {
                setData(newData);
                // Connection is established when we receive data
                setIsConnecting(false);
            },
            (err) => {
                setError(err);
                // Connection attempt failed
                setIsConnecting(false);
            }
        );

        unsubscribeRef.current = unsubscribe;

        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
    }, deps);

    return { data, error, isConnecting };
};
