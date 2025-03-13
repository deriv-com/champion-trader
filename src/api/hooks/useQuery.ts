import { useEffect, useCallback, useRef } from "react";
import { useApi } from "./useApi";

interface QueryOptions<T, P = void> {
    /**
     * Function that returns a promise with the data
     */
    queryFn: (params: P) => Promise<T>;

    /**
     * Parameters to pass to the query function
     */
    params: P;

    /**
     * Whether to fetch automatically on mount and when params change
     * @default true
     */
    enabled?: boolean;

    /**
     * Callback function called when the query is successful
     */
    onSuccess?: (data: T) => void;

    /**
     * Callback function called when the query fails
     */
    onError?: (error: Error) => void;
}

/**
 * A hook for data fetching with automatic refetching when parameters change
 * @template T The type of data returned by the query
 * @template P The type of parameters passed to the query function
 * @param options Query options
 * @returns Query result with data, error, loading state, and refetch function
 */
export const useQuery = <T, P = void>({
    queryFn,
    params,
    enabled = true,
    onSuccess,
    onError,
}: QueryOptions<T, P>) => {
    const api = useApi<T>();
    const { data, error, loading } = api;

    // Use refs to avoid recreating the fetchData function when callbacks change
    const onSuccessRef = useRef(onSuccess);
    const onErrorRef = useRef(onError);

    // Update refs when callbacks change
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;

    const fetchData = useCallback(async () => {
        const result = await api.execute(() => queryFn(params));
        if (result && onSuccessRef.current) {
            onSuccessRef.current(result as T);
        } else if (error && onErrorRef.current) {
            onErrorRef.current(error as Error);
        }
        return result;
    }, [api, queryFn, params, error]);

    useEffect(() => {
        if (enabled) {
            fetchData();
        }
    }, [enabled, fetchData]);

    return {
        data,
        error,
        loading,
        refetch: fetchData,
    };
};
