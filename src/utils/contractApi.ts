// Contract API functions for fetching contract details and transforming data
import {
    subscribeToOpenContracts,
    subscribeToClosedContracts,
} from "@/api/services/contract/contract-sse";

interface TickData {
    ask: string;
    bid: string;
    epoch_ms: number;
    price: string;
}

/**
 * Fetch contract details using the contract service
 * @param contractId The contract ID to fetch details for
 * @param accountId The account ID to use for the request
 * @returns A promise that resolves with the initial contract data
 */
export const fetchContractDetails = async (
    contractId: string,
    accountId: string = "active_account_id"
) => {
    return new Promise((resolve, reject) => {
        try {
            // Set up a flag to track if this is the first message
            let isFirstMessage = true;

            // Subscribe to open contracts stream
            const unsubscribe = subscribeToOpenContracts({
                onData: (data) => {
                    try {
                        // Find the contract with the matching ID
                        const contract = data.data.contracts.find(
                            (c) => c.contract_id === contractId
                        );

                        if (contract) {
                            const contractDetails = contract.contract_details;

                            // Ensure all epoch times are in seconds format
                            if (
                                contractDetails.entry_tick_time &&
                                contractDetails.entry_tick_time > 10000000000
                            ) {
                                contractDetails.entry_tick_time = Math.floor(
                                    contractDetails.entry_tick_time / 1000
                                );
                            }

                            if (
                                contractDetails.exit_tick_time &&
                                contractDetails.exit_tick_time > 10000000000
                            ) {
                                contractDetails.exit_tick_time = Math.floor(
                                    contractDetails.exit_tick_time / 1000
                                );
                            }

                            if (
                                contractDetails.contract_start_time &&
                                contractDetails.contract_start_time > 10000000000
                            ) {
                                contractDetails.contract_start_time = Math.floor(
                                    contractDetails.contract_start_time / 1000
                                );
                            }

                            if (
                                contractDetails.contract_expiry_time &&
                                contractDetails.contract_expiry_time > 10000000000
                            ) {
                                contractDetails.contract_expiry_time = Math.floor(
                                    contractDetails.contract_expiry_time / 1000
                                );
                            }

                            // Normalize tick_stream epoch_ms to seconds if needed
                            if (
                                contractDetails.tick_stream &&
                                Array.isArray(contractDetails.tick_stream)
                            ) {
                                contractDetails.tick_stream = contractDetails.tick_stream.map(
                                    (tick: TickData) => {
                                        if (tick.epoch_ms > 10000000000) {
                                            return {
                                                ...tick,
                                                epoch_ms: Math.floor(tick.epoch_ms / 1000) * 1000,
                                            };
                                        }
                                        return tick;
                                    }
                                );
                            }

                            // Transform the data into the format expected by the chart
                            const processedData = {
                                contractDetails,
                                ticksHistory: transformContractTickStream(
                                    contractDetails.tick_stream
                                ),
                                barriers: extractBarriers(contractDetails),
                                spotMarkers: extractSpotMarkers(contractDetails),
                                contractTimes: extractContractTimes(contractDetails),
                                symbol: contractDetails.instrument_id,
                                allTicks: contractDetails.tick_stream,
                            };

                            // For the first message, resolve the promise with the initial data
                            if (isFirstMessage) {
                                isFirstMessage = false;
                                resolve(processedData);
                            }

                            // Dispatch a custom event with the updated data
                            const contractUpdateEvent = new CustomEvent("contract_update", {
                                detail: processedData,
                            });
                            window.dispatchEvent(contractUpdateEvent);

                            // If the contract is sold or expired, unsubscribe
                            if (contractDetails.is_sold || contractDetails.is_expired) {
                                unsubscribe();
                            }
                        } else if (isFirstMessage) {
                            // If we didn't find the contract in open contracts, check closed contracts
                            checkClosedContracts(contractId, accountId, resolve, reject);
                            isFirstMessage = false;
                        }
                    } catch (error) {
                        console.error("Error processing contract data:", error);
                        if (isFirstMessage) {
                            isFirstMessage = false;
                            reject(error);
                        }
                    }
                },
                onError: (error) => {
                    console.error("Contract stream error:", error);
                    if (isFirstMessage) {
                        isFirstMessage = false;
                        reject(error);
                    }
                },
            });

            // Store the unsubscribe function in a global variable so it can be called later
            if (!(window as any).contractStreams) {
                (window as any).contractStreams = {};
            }
            (window as any).contractStreams[contractId] = unsubscribe;
        } catch (error) {
            console.error("Error in fetchContractDetails:", error);
            reject(error);
        }
    });
};

/**
 * Check closed contracts for a specific contract ID
 * @param contractId The contract ID to check for
 * @param accountId The account ID to use for the request
 * @param resolve The resolve function from the promise
 * @param reject The reject function from the promise
 */
const checkClosedContracts = (
    contractId: string,
    accountId: string,
    resolve: (value: any) => void,
    reject: (reason?: any) => void
) => {
    try {
        const unsubscribe = subscribeToClosedContracts({
            onData: (data) => {
                try {
                    // Find the contract with the matching ID
                    const contract = data.data.contracts.find((c) => c.contract_id === contractId);

                    if (contract) {
                        const contractDetails = contract.contract_details;

                        // Ensure all epoch times are in seconds format
                        if (
                            contractDetails.entry_tick_time &&
                            contractDetails.entry_tick_time > 10000000000
                        ) {
                            contractDetails.entry_tick_time = Math.floor(
                                contractDetails.entry_tick_time / 1000
                            );
                        }

                        if (
                            contractDetails.exit_tick_time &&
                            contractDetails.exit_tick_time > 10000000000
                        ) {
                            contractDetails.exit_tick_time = Math.floor(
                                contractDetails.exit_tick_time / 1000
                            );
                        }

                        if (
                            contractDetails.contract_start_time &&
                            contractDetails.contract_start_time > 10000000000
                        ) {
                            contractDetails.contract_start_time = Math.floor(
                                contractDetails.contract_start_time / 1000
                            );
                        }

                        if (
                            contractDetails.contract_expiry_time &&
                            contractDetails.contract_expiry_time > 10000000000
                        ) {
                            contractDetails.contract_expiry_time = Math.floor(
                                contractDetails.contract_expiry_time / 1000
                            );
                        }

                        // Normalize tick_stream epoch_ms to seconds if needed
                        if (
                            contractDetails.tick_stream &&
                            Array.isArray(contractDetails.tick_stream)
                        ) {
                            contractDetails.tick_stream = contractDetails.tick_stream.map(
                                (tick: TickData) => {
                                    if (tick.epoch_ms > 10000000000) {
                                        return {
                                            ...tick,
                                            epoch_ms: Math.floor(tick.epoch_ms / 1000) * 1000,
                                        };
                                    }
                                    return tick;
                                }
                            );
                        }

                        // Transform the data into the format expected by the chart
                        const processedData = {
                            contractDetails,
                            ticksHistory: transformContractTickStream(contractDetails.tick_stream),
                            barriers: extractBarriers(contractDetails),
                            spotMarkers: extractSpotMarkers(contractDetails),
                            contractTimes: extractContractTimes(contractDetails),
                            symbol: contractDetails.instrument_id,
                            allTicks: contractDetails.tick_stream,
                        };

                        resolve(processedData);
                        unsubscribe();
                    } else {
                        reject(new Error(`Contract ${contractId} not found`));
                        unsubscribe();
                    }
                } catch (error) {
                    console.error("Error processing closed contract data:", error);
                    reject(error);
                    unsubscribe();
                }
            },
            onError: (error) => {
                console.error("Closed contract stream error:", error);
                reject(error);
                unsubscribe();
            },
        });
    } catch (error) {
        console.error("Error checking closed contracts:", error);
        reject(error);
    }
};

/**
 * Close any open contract streams
 * @param contractId The contract ID to close the stream for, or undefined to close all streams
 */
export const closeContractStream = (contractId?: string) => {
    if (!(window as any).contractStreams) {
        return;
    }

    if (contractId) {
        // Close specific stream
        const unsubscribe = (window as any).contractStreams[contractId];
        if (unsubscribe) {
            unsubscribe();
            delete (window as any).contractStreams[contractId];
        }
    } else {
        // Close all streams
        Object.values((window as any).contractStreams).forEach((unsubscribe: any) => {
            unsubscribe();
        });
        (window as any).contractStreams = {};
    }
};

/**
 * Transform tick stream data from contract details to a format compatible with SmartChart
 * @param tickStream Array of tick data from contract details
 * @returns Transformed tick data for SmartChart
 */
export const transformContractTickStream = (tickStream: TickData[]) => {
    if (!tickStream || !Array.isArray(tickStream) || tickStream.length === 0) {
        return {
            history: {
                prices: [],
                times: [],
            },
            msg_type: "history",
            pip_size: 2,
        };
    }

    // Sort ticks by epoch_ms to ensure they are in chronological order
    const sortedTicks = [...tickStream].sort((a, b) => a.epoch_ms - b.epoch_ms);

    return {
        history: {
            prices: sortedTicks.map((tick) => tick.price),
            times: sortedTicks.map((tick) => Math.floor(tick.epoch_ms / 1000)), // Convert ms to seconds
        },
        msg_type: "history",
        pip_size: 2,
    };
};

/**
 * Extract barrier information from contract details
 * @param contractDetails Contract details object
 * @returns Array of barrier objects for SmartChart
 */
export const extractBarriers = (contractDetails: any) => {
    const barriers = [];

    if (contractDetails.barrier) {
        barriers.push({
            barrier: parseFloat(contractDetails.barrier),
            color: "#2196F3",
            label: "Barrier",
        });
    }

    return barriers;
};

/**
 * Extract spot markers from contract details
 * @param contractDetails Contract details object
 * @returns Object with entry and exit spot information
 */
export const extractSpotMarkers = (contractDetails: any) => {
    // Ensure times are in seconds format
    const entrySpotTime = contractDetails.entry_tick_time
        ? contractDetails.entry_tick_time > 10000000000
            ? Math.floor(contractDetails.entry_tick_time / 1000)
            : contractDetails.entry_tick_time
        : undefined;

    const exitSpotTime = contractDetails.exit_tick_time
        ? contractDetails.exit_tick_time > 10000000000
            ? Math.floor(contractDetails.exit_tick_time / 1000)
            : contractDetails.exit_tick_time
        : undefined;

    return {
        entrySpot: contractDetails.entry_spot ? parseFloat(contractDetails.entry_spot) : undefined,
        entrySpotTime,
        exitSpot: contractDetails.exit_spot ? parseFloat(contractDetails.exit_spot) : undefined,
        exitSpotTime,
    };
};

/**
 * Extract contract times
 * @param contractDetails Contract details object
 * @returns Object with start and end times
 */
export const extractContractTimes = (contractDetails: any) => {
    // Ensure times are in seconds format
    const startTime = contractDetails.contract_start_time
        ? contractDetails.contract_start_time > 10000000000
            ? Math.floor(contractDetails.contract_start_time / 1000)
            : contractDetails.contract_start_time
        : undefined;

    const endTime = contractDetails.contract_expiry_time
        ? contractDetails.contract_expiry_time > 10000000000
            ? Math.floor(contractDetails.contract_expiry_time / 1000)
            : contractDetails.contract_expiry_time
        : undefined;

    return {
        startTime,
        endTime,
    };
};

/**
 * Get all contract data needed for the replay chart
 * This function fetches contract details and transforms the data for the chart
 * @param contractId The contract ID to fetch details for
 * @param accountId The account ID to use for the request
 * @returns All data needed for the replay chart
 */
export const getContractReplayData = async (
    contractId: string,
    accountId: string = "active_account_id"
) => {
    try {
        // Fetch contract details
        const contractData = await fetchContractDetails(contractId, accountId);
        return contractData;
    } catch (error) {
        console.error("Error getting contract replay data:", error);
        throw error;
    }
};
