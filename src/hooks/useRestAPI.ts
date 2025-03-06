import { useState, useEffect, useCallback } from 'react';

/**
 * Generic type for API service functions
 * TData: The type of data returned by the API
 * TParams: The type of parameters accepted by the API function (void if no parameters)
 */
export type ApiServiceFunction<TData, TParams = void> = 
  TParams extends void 
    ? () => Promise<TData> 
    : (params: TParams) => Promise<TData>;

/**
 * Return type for the useRestAPI hook
 */
export interface UseRestAPIResult<TData> {
  data: TData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * A generic hook for making REST API calls
 * @param serviceFunction - The API service function to call
 * @param params - Optional parameters to pass to the service function
 * @param dependencies - Optional dependencies for the useEffect hook
 * @returns Object containing data, loading state, error state, and refetch function
 */
export function useRestAPI<TData, TParams = void>(
  serviceFunction: ApiServiceFunction<TData, TParams>,
  params?: TParams,
  dependencies: any[] = []
): UseRestAPIResult<TData> {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = params !== undefined 
        ? await serviceFunction(params as TParams) 
        : await (serviceFunction as () => Promise<TData>)();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('API request failed:', err);
    } finally {
      setLoading(false);
    }
  }, [serviceFunction, ...(params ? [params] : []), ...dependencies]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
