import { useState, useEffect } from "react";
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
    Contract,
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
 * @param contract_id Optional contract ID to filter results
 * @returns Subscription result with open contract data
 */
export const useOpenContractsStream = (options?: { enabled?: boolean }, contract_id?: string) => {
    return useSSESubscription<OpenContractsResponse>(
        (onData: (data: OpenContractsResponse) => void, onError: (error: any) => void) =>
            subscribeToOpenContracts({ onData, onError }, contract_id),
        [options?.enabled, contract_id]
    );
};

/**
 * Hook for subscribing to closed contracts stream
 * @param options Additional options for the subscription
 * @param contract_id Optional contract ID to filter results
 * @returns Subscription result with closed contract data
 */
export const useClosedContractsStream = (options?: { enabled?: boolean }, contract_id?: string) => {
    return useSSESubscription<ClosedContractsResponse>(
        (onData: (data: ClosedContractsResponse) => void, onError: (error: any) => void) =>
            subscribeToClosedContracts({ onData, onError }, contract_id),
        [options?.enabled, contract_id]
    );
};

/**
 * Hook for subscribing to contract details stream
 * @param contract_id The ID of the contract to get details for
 * @param isOpen Whether the contract is open or closed
 * @param options Additional options for the subscription
 * @returns Subscription result with contract details
 */
export const useContractDetailsStream = (
    contract_id: string,
    isOpen: boolean,
    options?: { enabled?: boolean }
) => {
    if (isOpen) {
        return useOpenContractsStream(options, contract_id);
    } else {
        return useClosedContractsStream(options, contract_id);
    }
};

/**
 * Hook for getting contract details for the Contract Details Page
 * @param contract_id The ID of the contract to get details for
 * @returns Contract details and loading state
 */
export const useContractDetails = (contract_id: string) => {
    const [contract, setContract] = useState<Contract | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(true); // Default to open
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // First try to get from open contracts
    const { data: openData, error: openError } = useContractDetailsStream(contract_id, true, {
        enabled: true,
    });

    // If not found in open contracts, try closed contracts
    const { data: closedData, error: closedError } = useContractDetailsStream(contract_id, false, {
        enabled: openData?.data.contracts.length === 0 || !!openError,
    });

    useEffect(() => {
        if (openData) {
            const foundContract = openData.data.contracts.find(
                (c) => c.contract_id === contract_id
            );

            if (foundContract) {
                setContract({
                    contract_id: foundContract.contract_id,
                    product_id: foundContract.product_id,
                    details: foundContract.contract_details,
                });
                setIsOpen(true);
                setLoading(false);
                return;
            }
        }

        if (closedData) {
            const foundContract = closedData.data.contracts.find(
                (c) => c.contract_id === contract_id
            );

            if (foundContract) {
                setContract({
                    contract_id: foundContract.contract_id,
                    product_id: foundContract.product_id,
                    details: foundContract.contract_details,
                });
                setIsOpen(false);
                setLoading(false);
                return;
            }
        }

        if (openError && closedError) {
            setError(new Error("Failed to fetch contract details"));
            setLoading(false);
        }
    }, [openData, closedData, openError, closedError, contract_id]);

    return { contract, isOpen, loading, error };
};
