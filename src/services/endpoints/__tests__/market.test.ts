const mockAxiosInstance = {
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  },
  post: jest.fn(),
  get: jest.fn(),
  delete: jest.fn()
};

// Mock axios must be before imports
jest.mock('axios', () => ({
  create: () => mockAxiosInstance
}));

import { marketService } from '../market';
import { Market, MarketPrice } from '../../api/types';

describe('marketService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMarkets', () => {
    it('should get all markets', async () => {
      const mockMarkets: Market[] = [
        {
          symbol: 'R_100',
          name: 'Volatility 100 Index',
          type: 'synthetic',
          active: true,
          volatility: 100,
        },
      ];

      const mockResponse = {
        data: {
          data: mockMarkets,
          status: 200,
        },
      };

      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      const result = await marketService.getMarkets();

      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/markets');
    });
  });

  describe('getMarketBySymbol', () => {
    it('should get market details by symbol', async () => {
      const mockMarket: Market = {
        symbol: 'R_100',
        name: 'Volatility 100 Index',
        type: 'synthetic',
        active: true,
        volatility: 100,
      };

      const mockResponse = {
        data: {
          data: mockMarket,
          status: 200,
        },
      };

      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      const result = await marketService.getMarketBySymbol('R_100');

      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/markets/R_100');
    });
  });

  describe('getMarketPrice', () => {
    it('should get current price for a market', async () => {
      const mockPrice: MarketPrice = {
        symbol: 'R_100',
        price: 1234.56,
        timestamp: '2024-01-28T00:00:00Z',
      };

      const mockResponse = {
        data: {
          data: mockPrice,
          status: 200,
        },
      };

      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      const result = await marketService.getMarketPrice('R_100');

      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/markets/R_100/price');
    });
  });

  describe('getPriceHistory', () => {
    it('should get price history for a market', async () => {
      const mockPrices: MarketPrice[] = [
        {
          symbol: 'R_100',
          price: 1234.56,
          timestamp: '2024-01-28T00:00:00Z',
        },
        {
          symbol: 'R_100',
          price: 1235.67,
          timestamp: '2024-01-28T00:01:00Z',
        },
      ];

      const mockResponse = {
        data: {
          data: mockPrices,
          total: 2,
          page: 1,
          limit: 10,
        },
      };

      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      const from = '2024-01-28T00:00:00Z';
      const to = '2024-01-28T00:01:00Z';
      const result = await marketService.getPriceHistory('R_100', from, to);

      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/markets/R_100/history', {
        params: { from, to },
      });
    });
  });

  describe('subscribeToPriceUpdates', () => {
    it('should throw error for unimplemented WebSocket', async () => {
      await expect(marketService.subscribeToPriceUpdates('R_100')).rejects.toThrow(
        'WebSocket implementation required'
      );
    });
  });
});
