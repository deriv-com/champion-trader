import { useEffect, useRef } from "react";

/**
 * A hook that debounces a value and calls a callback after the specified delay.
 * Uses a ref for the callback to prevent unnecessary effect runs.
 *
 * @param value The value to debounce
 * @param callback The function to call with the debounced value
 * @param delay The delay in milliseconds (default: 500ms)
 */
export function useDebounce<T>(value: T, callback: (value: T) => void, delay: number = 500): void {
    // Keep reference to latest callback
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            callbackRef.current(value);
        }, delay);

        // Clear timeout if value changes or component unmounts
        return () => clearTimeout(timeoutId);
    }, [value, delay]); // callback not needed in deps as we use ref
}
