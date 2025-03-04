import { apiClient } from '../../axios_interceptor';
import { ProductConfigResponse, ProductConfigRequest } from './types';

/**
 * Fetches product configuration from the API
 * @param params Request parameters including product_type and instrument_id
 * @returns Promise resolving to product configuration
 */
export const getProductConfig = async (
  params: ProductConfigRequest
): Promise<ProductConfigResponse> => {
  const { product_type, instrument_id } = params;
  const response = await apiClient.get<ProductConfigResponse>(
    `/v1/market/products/${product_type}/config`,
    {
      params: { instrument_id }
    }
  );
  return response.data;
};
