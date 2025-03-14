import { apiClient } from "@/api/base/rest";
import { AvailableInstrumentsRequest, AvailableInstrumentsResponse } from "./types";

/**
 * Fetches available trading instruments
 * @param request Request parameters including app_id and account_type
 * @returns Promise resolving to list of available instruments
 * @throws AxiosError with ErrorResponse data on validation or server errors
 */
export const getAvailableInstruments = async (
    request: AvailableInstrumentsRequest
): Promise<AvailableInstrumentsResponse> => {
    const response = await apiClient.post<AvailableInstrumentsResponse>(
        "/available_instruments",
        request
    );
    return response.data;
};
