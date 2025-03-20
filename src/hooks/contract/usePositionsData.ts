import { useEffect } from "react";
import { useTradeStore } from "@/stores/tradeStore";
import { useOpenContractsStream, useClosedContractsStream } from "./useContract";
import { ClosedContractsResponse } from "@/api/services/contract/types";
import { calculateTotalProfitLoss } from "@/components/PositionComponents/utils/profit-loss";

/**
 * Hook for managing positions data in the store
 * This hook centralizes the logic for fetching positions data and updating the store
 * @returns The current positions data and loading state
 */
export const usePositionsData = () => {
    // Get data from contract streams
    const { data: openData, error: openError } = useOpenContractsStream();
    const { data: closedData, error: closedError } = useClosedContractsStream();

    // Get store actions and state
    const {
        openPositions,
        closedPositions,
        positionsLoading,
        positionsError,
        setOpenPositions,
        setClosedPositions,
        setPositionsLoading,
        setPositionsError,
    } = useTradeStore();

    // Set initial loading state
    useEffect(() => {
        setPositionsLoading(true);
    }, [setPositionsLoading]);

    // Update store with open positions data
    useEffect(() => {
        if (openData) {
            setOpenPositions(openData);
            setPositionsLoading(false);
        }
    }, [openData, setOpenPositions, setPositionsLoading]);

    // Update store with closed positions data
    useEffect(() => {
        if (closedData) {
            setClosedPositions(closedData as unknown as ClosedContractsResponse);
            setPositionsLoading(false);
        }
    }, [closedData, setClosedPositions, setPositionsLoading]);

    // Handle errors
    useEffect(() => {
        if (openError) {
            setPositionsError(openError);
        }
    }, [openError, setPositionsError]);

    useEffect(() => {
        if (closedError) {
            setPositionsError(closedError);
        }
    }, [closedError, setPositionsError]);

    // Calculate total profit/loss
    const totalProfitLoss = calculateTotalProfitLoss(openPositions);

    // Sort open positions by contract_start_time (newest first)
    const sortedOpenPositions = [...openPositions].sort(
        (a, b) => b.details.contract_start_time - a.details.contract_start_time
    );

    // Sort closed positions by contract_expiry_time (newest first)
    const sortedClosedPositions = [...closedPositions].sort(
        (a, b) => b.details.contract_expiry_time - a.details.contract_expiry_time
    );

    return {
        openPositions: sortedOpenPositions,
        closedPositions: sortedClosedPositions,
        positionsLoading,
        positionsError,
        totalProfitLoss,
    };
};
