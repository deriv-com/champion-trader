import { apiClient } from "@/api/base/rest";
import { AccountsResponse } from "./types";

/**
 * Get user accounts
 * @returns Promise with accounts response
 */
export const getAccounts = async (): Promise<AccountsResponse> => {
    const response = await apiClient.get<AccountsResponse>("/v1/accounts");
    return response.data;
};
