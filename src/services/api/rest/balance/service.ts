import { apiClient } from "../../axios_interceptor";
import { BalanceRequest, BalanceResponse } from "./types";

/**
 * Fetches account balance from the API
 * @param params Request parameters including account_uuid
 * @returns Promise resolving to balance information
 */
export const getBalance = async (params: BalanceRequest): Promise<BalanceResponse> => {
    const { account_uuid } = params;
    const response = await apiClient.get<{ data: BalanceResponse }>(`/v1/accounting/balance`, {
        params: {
            account_uuid,
        },
    });
    return response.data.data;
};
