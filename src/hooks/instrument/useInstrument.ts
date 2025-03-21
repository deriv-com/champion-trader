import { useMutation } from "@/api/hooks";
import {
    getAvailableInstruments,
    InstrumentApiError,
} from "@/api/services/instrument/instrument-rest";
import {
    AvailableInstrumentsRequest,
    AvailableInstrumentsResponse,
} from "@/api/services/instrument/types";

/**
 * Hook for fetching available instruments from the API
 *
 * @param options Additional options for the mutation
 * @param options.onSuccess Callback function called when instruments are successfully fetched
 * @param options.onError Callback function called when an error occurs during fetch
 * @returns Mutation result with available instruments data and control functions
 *
 * @example
 * ```typescript
 * const { mutate, loading, data } = useAvailableInstruments({
 *   onSuccess: (response) => {
 *     console.log('Instruments:', response.data.instruments);
 *   },
 *   onError: (error) => {
 *     console.error('Failed to fetch instruments:', error.message);
 *   }
 * });
 *
 * // Fetch instruments for a specific product
 * mutate({ product_id: 'rise_fall' });
 * ```
 */
export const useAvailableInstruments = (options?: {
    onSuccess?: (data: AvailableInstrumentsResponse) => void;
    onError?: (error: Error | InstrumentApiError) => void;
}) => {
    return useMutation<AvailableInstrumentsResponse, AvailableInstrumentsRequest>({
        mutationFn: getAvailableInstruments,
        onSuccess: options?.onSuccess,
        onError: options?.onError,
    });
};
