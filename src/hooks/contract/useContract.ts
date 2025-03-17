import { useMutation } from "@/api/hooks";
import { useSSESubscription } from "@/api/hooks";
import { buyContract, sellContract } from "@/api/services/contract/contract-rest";
import {
    subscribeToOpenContracts,
    subscribeToClosedContracts,
} from "@/api/services/contract/contract-sse";
import {
    BuyContractRequest,
    BuyContractResponse,
    SellContractRequest,
    SellContractResponse,
    OpenContractsResponse,
    ClosedContractsResponse,
} from "@/api/services/contract/types";

/**
 * Hook for buying a contract
 * @param options Additional options for the mutation
 * @returns Mutation result with buy contract response
 */
export const useBuyContract = (options?: {
    onSuccess?: (data: BuyContractResponse) => void;
    onError?: (error: Error) => void;
}) => {
    return useMutation<BuyContractResponse, BuyContractRequest>({
        mutationFn: buyContract,
        onSuccess: options?.onSuccess,
        onError: options?.onError,
    });
};

/**
 * Hook for selling a contract
 * @param options Additional options for the mutation
 * @returns Mutation result with sell contract response
 */
export const useSellContract = (options?: {
    onSuccess?: (data: SellContractResponse) => void;
    onError?: (error: Error) => void;
}) => {
    return useMutation<SellContractResponse, SellContractRequest>({
        mutationFn: sellContract,
        onSuccess: options?.onSuccess,
        onError: options?.onError,
    });
};

/**
 * Hook for subscribing to open contracts stream
 * @param options Additional options for the subscription
 * @returns Subscription result with open contract data
 */
export const useOpenContractsStream = (options?: { enabled?: boolean }) => {
    return useSSESubscription<OpenContractsResponse>(
        (onData: (data: OpenContractsResponse) => void, onError: (error: any) => void) =>
            subscribeToOpenContracts({ onData, onError }),
        [options?.enabled]
    );
};

/**
 * Hook for subscribing to closed contracts stream
 * @param options Additional options for the subscription
 * @returns Subscription result with closed contract data
 */
export const useClosedContractsStream = (options?: { enabled?: boolean }) => {
    return useSSESubscription<ClosedContractsResponse>(
        (onData: (data: ClosedContractsResponse) => void, onError: (error: any) => void) =>
            subscribeToClosedContracts({ onData, onError }),
        [options?.enabled]
    );
};
