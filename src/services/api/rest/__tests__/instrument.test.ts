import { getAvailableInstruments } from '../instrument/service';
import { AvailableInstrumentsRequest, AvailableInstrumentsResponse } from '../types';
import { apiClient } from '../../axios_interceptor';

// Mock the axios interceptor
jest.mock('../../axios_interceptor', () => ({
  apiClient: {
    post: jest.fn()
  }
}));

describe('getAvailableInstruments', () => {
  beforeEach(() => {
    (apiClient.post as jest.Mock).mockClear();
  });

  it('fetches available instruments successfully', async () => {
    const mockResponse: AvailableInstrumentsResponse = {
      instruments: [
        { id: 'EURUSD', name: 'EUR/USD' },
        { id: 'GBPUSD', name: 'GBP/USD' }
      ]
    };

    (apiClient.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

    const request: AvailableInstrumentsRequest = {
      instrument: 'forex',
      context: {
        app_id: '1001'
      }
    };

    const response = await getAvailableInstruments(request);
    
    expect(apiClient.post).toHaveBeenCalledWith('/available_instruments', request);
    expect(response).toEqual(mockResponse);
  });

  it('handles API errors', async () => {
    const mockError = new Error('API Error');
    (apiClient.post as jest.Mock).mockRejectedValueOnce(mockError);

    const request: AvailableInstrumentsRequest = {
      instrument: 'forex',
      context: {
        app_id: '1001'
      }
    };

    await expect(getAvailableInstruments(request)).rejects.toThrow('API Error');
    expect(apiClient.post).toHaveBeenCalledWith('/available_instruments', request);
  });
});
