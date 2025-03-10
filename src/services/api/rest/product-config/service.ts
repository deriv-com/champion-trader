import { apiClient } from "../../axios_interceptor";
import { ProductConfigResponse, ProductConfigRequest } from "./types";

/**
 * Fetches product configuration from the API
 * @param params Request parameters including product_id, instrument_id and account_uuid
 * @returns Promise resolving to product configuration
 */
export const getProductConfig = async (
    params: ProductConfigRequest
): Promise<ProductConfigResponse> => {
    const { instrument_id, product_id } = params;
    const response = await apiClient.get<ProductConfigResponse>(`/v1/market/products/config`, {
        params: {
            instrument_id,
            product_id,
            account_uuid: "",
        },
    });
    return response.data;
};
