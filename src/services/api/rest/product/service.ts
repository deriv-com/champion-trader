import { apiClient } from "../../axios_interceptor";
import { ProductsResponse } from "../types";

/**
 * Fetches available products
 * @returns Promise resolving to list of available products
 * @throws AxiosError with ErrorResponse data on validation or server errors
 */
export const getProducts = async (): Promise<ProductsResponse> => {
    const response = await apiClient.get<ProductsResponse>(
        "/v1/market/products"
    );
    return response.data;
};
