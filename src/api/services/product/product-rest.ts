import { apiClient } from "@/api/base/rest";
import { ProductsResponse, ProductConfigResponse, ProductConfigRequest } from "./types";

/**
 * Fetches available products
 * @returns Promise resolving to list of available products
 * @throws AxiosError with ErrorResponse data on validation or server errors
 */
export const getProducts = async (): Promise<ProductsResponse> => {
    const response = await apiClient.get<ProductsResponse>("/v1/market/products");
    return response.data;
};

/**
 * Fetches product configuration from the API
 * @param params Request parameters including product_type and instrument_id
 * @returns Promise resolving to product configuration
 */
export const getProductConfig = async (
    params: ProductConfigRequest
): Promise<ProductConfigResponse> => {
    const { product_id, instrument_id, account_uuid } = params;
    const response = await apiClient.get<ProductConfigResponse>(`/v1/market/products/config`, {
        params: { instrument_id, product_id, account_uuid },
    });
    return response.data;
};
