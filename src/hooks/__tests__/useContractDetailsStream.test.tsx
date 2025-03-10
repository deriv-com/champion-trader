import { renderHook } from '@testing-library/react-hooks';
import { useContractDetailsStream } from '../useContractDetailsStream';
import { createSSEConnection } from '@/services/api/sse/createSSEConnection';
import { useTradeStore } from '@/stores/tradeStore';

// Mock dependencies
jest.mock('@/services/api/sse/createSSEConnection');
jest.mock('@/stores/tradeStore', () => ({
  useTradeStore: jest.fn()
}));

describe('useContractDetailsStream', () => {
  const mockCleanup = jest.fn();
  const mockSetContractDetails = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the createSSEConnection function
    (createSSEConnection as jest.Mock).mockImplementation((options) => {
      // Simulate a successful connection
      setTimeout(() => {
        options.onOpen?.();
        
        // Simulate receiving contract data
        options.onMessage({
          contract_id: '123',
          product_id: 'test_product',
          contract_details: {
            variant: 'rise',
            instrument_name: 'Test Market',
            stake: '10.00',
            profit_loss: '+5.00',
            duration: 5,
            duration_units: 'minutes',
            barrier: '1000.00',
            potential_payout: '15.00',
            reference_id: 'ref123',
            start_time: 1609459202000, // 2021-01-01 00:00:02
            entry_spot: '990.00',
            exit_time: 1609462836000, // 2021-01-01 01:00:36
            exit_spot: '1010.00',
            allow_equals: false,
            bid_price: '10.00',
            bid_price_currency: 'USD',
            expiry: 1609462836000,
            instrument_id: 'R_100',
            is_expired: true,
            is_sold: true,
            is_valid_to_sell: false,
            pricing_tick_id: 'tick123'
          }
        });
      }, 10);
      
      return mockCleanup;
    });
    
    // Mock the useTradeStore hook
    (useTradeStore as unknown as jest.Mock).mockImplementation(() => ({
      setContractDetails: mockSetContractDetails
    }));
  });
  
  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useContractDetailsStream('123'));
    
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });
  
  it('should create an SSE connection with the correct endpoint', () => {
    renderHook(() => useContractDetailsStream('123'));
    
    expect(createSSEConnection).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: '/v1/trading/contracts/123/stream'
      })
    );
  });
  
  it('should update contract details when data is received', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useContractDetailsStream('123'));
    
    await waitForNextUpdate();
    
    expect(mockSetContractDetails).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'Rise',
        market: 'Test Market',
        stake: '10.00',
        profit: '+5.00'
      })
    );
    
    expect(result.current.loading).toBe(false);
  });
  
  it('should handle errors', async () => {
    // Mock an error
    (createSSEConnection as jest.Mock).mockImplementation((options) => {
      setTimeout(() => {
        options.onError?.('Test error');
      }, 10);
      
      return mockCleanup;
    });
    
    const { result, waitForNextUpdate } = renderHook(() => useContractDetailsStream('123'));
    
    await waitForNextUpdate();
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Failed to stream contract details');
  });
  
  it('should clean up the SSE connection on unmount', () => {
    const { unmount } = renderHook(() => useContractDetailsStream('123'));
    
    unmount();
    
    expect(mockCleanup).toHaveBeenCalled();
  });
  
  it('should not create an SSE connection if contractId is undefined', () => {
    renderHook(() => useContractDetailsStream(undefined));
    
    expect(createSSEConnection).not.toHaveBeenCalled();
  });
});
