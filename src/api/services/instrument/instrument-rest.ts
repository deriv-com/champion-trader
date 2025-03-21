import { apiClient } from "@/api/base/rest";
import { AxiosError } from "axios";
import { AvailableInstrumentsRequest, AvailableInstrumentsResponse } from "./types";

/**
 * Custom error class for instrument API errors
 */
export class InstrumentApiError extends Error {
    statusCode?: number;
    errorCode?: string;

    constructor(message: string, statusCode?: number, errorCode?: string) {
        super(message);
        this.name = "InstrumentApiError";
        this.statusCode = statusCode;
        this.errorCode = errorCode;
    }
}

/**
 * Fetches available trading instruments
 * @param request Request parameters including optional product_id and account_uuid
 * @returns Promise resolving to list of available instruments
 * @throws InstrumentApiError or AxiosError on failure
 */
export const getAvailableInstruments = async (
    request: AvailableInstrumentsRequest
): Promise<AvailableInstrumentsResponse> => {
    try {
        const response = await apiClient.get<AvailableInstrumentsResponse>(
            "/v1/market/instruments",
            { params: request }
        );

        // Validate response structure
        if (
            !response.data ||
            !response.data.data ||
            !Array.isArray(response.data.data.instruments)
        ) {
            throw new InstrumentApiError("Invalid response structure from instruments API");
        }

        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            const statusCode = error.response?.status;
            const errorMessage = error.response?.data?.message || error.message;
            const errorCode = error.response?.data?.error_code;

            throw new InstrumentApiError(
                `Failed to fetch instruments: ${errorMessage}`,
                statusCode,
                errorCode
            );
        }

        // Re-throw if it's already an InstrumentApiError
        if (error instanceof InstrumentApiError) {
            throw error;
        }

        // For any other type of error
        throw new InstrumentApiError(
            `Unexpected error fetching instruments: ${(error as Error).message}`
        );
    }
};
