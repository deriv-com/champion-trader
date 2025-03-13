import { useState, useCallback } from "react";

/**
 * A generic hook for making API calls with loading, error, and data states
 * @template T The type of data returned by the API call
 * @template E The type of error returned by the API call
 * @returns An object with data, error, loading states and an execute function
 */
export const useApi = <T, E = Error>() => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<E | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const execute = useCallback(async <R>(apiCall: () => Promise<R>): Promise<R | null> => {
        setLoading(true);
        setError(null);

        try {
            const result = await apiCall();
            setData(result as unknown as T);
            return result;
        } catch (err) {
            setError(err as E);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, error, loading, execute };
};
