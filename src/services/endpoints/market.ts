import { apiClient } from '../api/config';
import { ApiResponse, Market, MarketPrice, PaginatedResponse } from '../api/types';

export const marketService = {
  /**
   * Get all available markets
   */
  getMarkets: async (): Promise<ApiResponse<Market[]>> => {
    const response = await apiClient.get<ApiResponse<Market[]>>('/markets');
    return response.data;
  },

  /**
   * Get market details by symbol
   */
  getMarketBySymbol: async (symbol: string): Promise<ApiResponse<Market>> => {
    const response = await apiClient.get<ApiResponse<Market>>(`/markets/${symbol}`);
    return response.data;
  },

  /**
   * Get current price for a market
   */
  getMarketPrice: async (symbol: string): Promise<ApiResponse<MarketPrice>> => {
    const response = await apiClient.get<ApiResponse<MarketPrice>>(`/markets/${symbol}/price`);
    return response.data;
  },

  /**
   * Get price history for a market
   */
  getPriceHistory: async (
    symbol: string,
    from: string,
    to: string
  ): Promise<PaginatedResponse<MarketPrice>> => {
    const response = await apiClient.get<PaginatedResponse<MarketPrice>>(`/markets/${symbol}/history`, {
      params: { from, to },
    });
    return response.data;
  },

  /**
   * Subscribe to real-time price updates
   * This is a placeholder - actual implementation would depend on WebSocket setup
   */
  subscribeToPriceUpdates: async (symbol: string): Promise<void> => {
    // WebSocket implementation would go here
    console.log(`Subscribing to price updates for ${symbol}`);
    throw new Error(`WebSocket implementation required for ${symbol}`);
  },
};
