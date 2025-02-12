import { renderHook } from '@testing-library/react-hooks';
import { useContractSSE } from '../useContractSSE';
import { ContractPriceRequest, ContractPriceResponse, WebSocketError } from '@/services/api/websocket/types';

// Mock the SSE store
const mockStore = {
  initializeContractService: jest.fn(),
  requestContractPrice: jest.fn(),
  cancelContractPrice: jest.fn(),
  contractPrices: {} as Record<string, ContractPriceResponse>,
  isContractConnected: false,
  contractError: null as WebSocketError | Event | null
};

jest.mock('@/stores/sseStore', () => ({
  useSSEStore: jest.fn((selector) => {
    if (typeof selector === 'function') {
      return selector(mockStore);
    }
    return mockStore;
  })
}));

describe('useContractSSE', () => {
  const mockAuthToken = 'test-auth-token';
  const mockRequest: ContractPriceRequest = {
    duration: '1m',
    instrument: 'R_100',
    trade_type: 'CALL',
    currency: 'USD',
    payout: '100',
    strike: '1234.56'
  };

  const mockResponse: ContractPriceResponse = {
    date_start: Date.now(),
    date_expiry: Date.now() + 60000,
    spot: '1234.56',
    strike: mockRequest.strike || '1234.56',
    price: '5.67',
    trade_type: mockRequest.trade_type,
    instrument: mockRequest.instrument,
    currency: mockRequest.currency,
    payout: mockRequest.payout,
    pricing_parameters: {
      volatility: '0.5',
      duration_in_years: '0.00190259'
    }
  };

  const contractKey = JSON.stringify({
    duration: mockRequest.duration,
    instrument: mockRequest.instrument,
    trade_type: mockRequest.trade_type,
    currency: mockRequest.currency,
    payout: mockRequest.payout,
    strike: mockRequest.strike
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.contractPrices = {};
    mockStore.isContractConnected = false;
    mockStore.contractError = null;
  });

  it('should initialize contract service and request price', () => {
    renderHook(() => useContractSSE(mockRequest, mockAuthToken));

    expect(mockStore.initializeContractService).toHaveBeenCalledWith(mockAuthToken);
    expect(mockStore.requestContractPrice).toHaveBeenCalledWith(mockRequest);
  });

  it('should cancel price request on unmount', () => {
    const { unmount } = renderHook(() => useContractSSE(mockRequest, mockAuthToken));
    unmount();

    expect(mockStore.cancelContractPrice).toHaveBeenCalledWith(mockRequest);
  });

  it('should call onPrice when price updates', () => {
    const onPrice = jest.fn();
    const { rerender } = renderHook(() => useContractSSE(mockRequest, mockAuthToken, { onPrice }));

    // Initially no price
    expect(onPrice).not.toHaveBeenCalled();

    // Simulate price update
    mockStore.contractPrices = { [contractKey]: mockResponse };
    rerender();

    expect(onPrice).toHaveBeenCalledWith(mockResponse);
  });

  it('should call onConnect and request price when connection is established', () => {
    const onConnect = jest.fn();
    mockStore.isContractConnected = false;

    const { rerender } = renderHook(() => useContractSSE(mockRequest, mockAuthToken, { onConnect }));

    // Initially not connected
    expect(onConnect).not.toHaveBeenCalled();
    expect(mockStore.requestContractPrice).toHaveBeenCalledTimes(1); // Initial request

    // Simulate connection established
    mockStore.isContractConnected = true;
    rerender();

    expect(onConnect).toHaveBeenCalled();
    expect(mockStore.requestContractPrice).toHaveBeenCalledTimes(2); // Re-requested after connection
    expect(mockStore.requestContractPrice).toHaveBeenLastCalledWith(mockRequest);
  });

  it('should call onDisconnect when connection is lost', () => {
    const onDisconnect = jest.fn();
    mockStore.isContractConnected = true;

    const { rerender } = renderHook(() => useContractSSE(mockRequest, mockAuthToken, { onDisconnect }));

    // Initially connected
    expect(onDisconnect).not.toHaveBeenCalled();

    // Simulate connection lost
    mockStore.isContractConnected = false;
    rerender();

    expect(onDisconnect).toHaveBeenCalled();
  });

  it('should call onError when WebSocketError occurs', () => {
    const onError = jest.fn();
    const mockError: WebSocketError = { error: 'Authentication failed' };
    mockStore.contractError = mockError;

    renderHook(() => useContractSSE(mockRequest, mockAuthToken, { onError }));

    expect(onError).toHaveBeenCalledWith(mockError);
  });

  it('should call onError when Event error occurs', () => {
    const onError = jest.fn();
    const mockError = new Event('error');
    mockStore.contractError = mockError;

    renderHook(() => useContractSSE(mockRequest, mockAuthToken, { onError }));

    expect(onError).toHaveBeenCalledWith(mockError);
  });

  it('should return current price and connection state', () => {
    mockStore.contractPrices = { [contractKey]: mockResponse };
    mockStore.isContractConnected = true;

    const { result } = renderHook(() => useContractSSE(mockRequest, mockAuthToken));

    expect(result.current).toEqual({
      price: mockResponse,
      isConnected: true,
      error: null
    });
  });

  it('should request new price when request params change', () => {
    const { rerender } = renderHook(
      ({ request }) => useContractSSE(request, mockAuthToken),
      { initialProps: { request: mockRequest } }
    );

    const newRequest = { ...mockRequest, duration: '2m' };
    rerender({ request: newRequest });

    expect(mockStore.cancelContractPrice).toHaveBeenCalledWith(mockRequest);
    expect(mockStore.requestContractPrice).toHaveBeenCalledWith(newRequest);
  });

  it('should reinitialize service when auth token changes', () => {
    const { rerender } = renderHook(
      ({ token }) => useContractSSE(mockRequest, token),
      { initialProps: { token: mockAuthToken } }
    );

    const newToken = 'new-auth-token';
    rerender({ token: newToken });

    expect(mockStore.initializeContractService).toHaveBeenCalledWith(newToken);
    expect(mockStore.requestContractPrice).toHaveBeenCalledWith(mockRequest);
  });
});
