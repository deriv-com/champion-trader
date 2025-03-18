import { apiClient } from "@/api/base/rest";
import {
    BuyContractRequest,
    BuyContractResponse,
    SellContractRequest,
    SellContractResponse,
} from "./types";

/**
 * Buy a contract
 * @param requestBody The request body containing contract details
 * @param queryParams Optional query parameters (e.g., account_uuid)
 * @returns Promise with buy contract response
 */
export const buyContract = async (
    requestBody: BuyContractRequest,
    queryParams?: { account_uuid?: string }
): Promise<BuyContractResponse> => {
    const response = await apiClient.post<BuyContractResponse>(
        "/v1/trading/contracts/buy",
        requestBody,
        { params: queryParams }
    );
    return response.data;
};

/**
 * Sell a contract
 * @param params SellContractRequest containing contract_id and optional account_uuid
 * @returns Promise with sell contract response
 */
export const sellContract = async (params: SellContractRequest): Promise<SellContractResponse> => {
    // Extract parameters for query params
    const { contract_id, account_uuid } = params;

    // Create query parameters object
    const queryParams = {
        contract_id,
        ...(account_uuid ? { account_uuid } : {}),
    };

    const response = await apiClient.post<SellContractResponse>(
        "/v1/trading/contracts/sell",
        {}, // Empty request body as per API spec
        { params: queryParams } // All parameters as query params
    );
    return response.data;
};
