import { useState, useEffect, useRef } from "react";

/**
 * A hook for subscribing to SSE events
 * @template T The type of data received from the subscription
 * @param subscribe A function that sets up the subscription and returns an unsubscribe function
 * @param deps Dependencies array that will trigger resubscription when changed
 * @returns An object with the latest data and any error
 */
export const useSSESubscription = <T>(
    subscribe: (onData: (data: T) => void, onError: (error: any) => void) => () => void,
    deps: any[] = []
) => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const unsubscribeRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        const unsubscribe = subscribe(
            (newData) => setData(newData),
            (err) => setError(err)
        );

        unsubscribeRef.current = unsubscribe;

        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
    }, deps);

    return { data, error };
};
