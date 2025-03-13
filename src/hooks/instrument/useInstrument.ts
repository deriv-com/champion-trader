import { useMutation } from "@/api/hooks";
import { getAvailableInstruments } from "@/api/services/instrument/instrument-rest";
import {
    AvailableInstrumentsRequest,
    AvailableInstrumentsResponse,
} from "@/api/services/instrument/types";

/**
 * Hook for fetching available instruments
 * @param options Additional options for the mutation
 * @returns Mutation result with available instruments data
 */
export const useAvailableInstruments = (options?: {
    onSuccess?: (data: AvailableInstrumentsResponse) => void;
    onError?: (error: Error) => void;
}) => {
    return useMutation<AvailableInstrumentsResponse, AvailableInstrumentsRequest>({
        mutationFn: getAvailableInstruments,
        onSuccess: options?.onSuccess,
        onError: options?.onError,
    });
};
