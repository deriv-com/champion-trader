import { useQuery } from "@/api/hooks";
import { getProducts } from "@/api/services/product/product-rest";
import { ProductsResponse } from "@/api/services/product/types";

/**
 * Hook for fetching available products
 * @param options Additional options for the query
 * @returns Query result with products data
 */
export const useProducts = (options?: {
    enabled?: boolean;
    onSuccess?: (data: ProductsResponse) => void;
    onError?: (error: Error) => void;
}) => {
    return useQuery<ProductsResponse, void>({
        queryFn: getProducts,
        params: undefined,
        enabled: options?.enabled,
        onSuccess: options?.onSuccess,
        onError: options?.onError,
    });
};
