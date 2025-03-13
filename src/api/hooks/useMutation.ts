import { useCallback, useRef } from "react";
import { useApi } from "./useApi";

interface MutationOptions<T, P> {
    /**
     * Function that performs the mutation and returns a promise
     */
    mutationFn: (params: P) => Promise<T>;

    /**
     * Callback function called when the mutation is successful
     */
    onSuccess?: (data: T) => void;

    /**
     * Callback function called when the mutation fails
     */
    onError?: (error: Error) => void;
}

/**
 * A hook for performing data mutations (create, update, delete operations)
 * @template T The type of data returned by the mutation
 * @template P The type of parameters passed to the mutation function
 * @param options Mutation options
 * @returns Mutation result with data, error, loading state, and mutate function
 */
export const useMutation = <T, P>({ mutationFn, onSuccess, onError }: MutationOptions<T, P>) => {
    const api = useApi<T>();
    const { data, error, loading } = api;

    // Use refs to avoid recreating the mutate function when callbacks change
    const onSuccessRef = useRef(onSuccess);
    const onErrorRef = useRef(onError);

    // Update refs when callbacks change
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;

    const mutate = useCallback(
        async (params: P) => {
            const result = await api.execute(() => mutationFn(params));
            if (result && onSuccessRef.current) {
                onSuccessRef.current(result as T);
            } else if (error && onErrorRef.current) {
                onErrorRef.current(error as Error);
            }
            return result;
        },
        [api, mutationFn, error]
    );

    return {
        data,
        error,
        loading,
        mutate,
    };
};
