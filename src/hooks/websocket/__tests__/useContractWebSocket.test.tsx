import { renderHook } from '@testing-library/react-hooks';
import { useContractWebSocket } from '../useContractWebSocket';
import { useWebSocketStore } from '@/stores/websocketStore';
import { ContractPriceRequest, ContractPriceResponse, WebSocketError } from '@/services/api/websocket/types';

// Mock the websocket store
jest.mock('@/stores/websocketStore');

interface MockStore {
  initializeContractService: jest.Mock;
  requestContractPrice: jest.Mock;
  cancelContractPrice: jest.Mock;
  contractPrices: Record<string, ContractPriceResponse>;
  isContractConnected: boolean;
  contractError: WebSocketError | null;
}

describe('useContractWebSocket', () => {
  const mockInitializeContractService = jest.fn();
  const mockRequestContractPrice = jest.fn();
  const mockCancelContractPrice = jest.fn();
  const mockOnPrice = jest.fn();
  const mockOnError = jest.fn();
  const mockOnConnect = jest.fn();
  const mockOnDisconnect = jest.fn();

  const mockRequest: ContractPriceRequest = {
    duration: "1h",
    instrument: "R_100",
    trade_type: "CALL",
    currency: "USD",
    payout: "100"
  };

  const mockPrice: ContractPriceResponse = {
    date_start: 1706601600,
    date_expiry: 1706605200,
    spot: "1234.56",
    strike: "1234.56",
    price: "5.67",
    trade_type: "CALL",
    instrument: "R_100",
    currency: "USD",
    payout: "100",
    pricing_parameters: {
      volatility: "23.5",
      duration_in_years: "0.0417"
    }
  };

  const mockAuthToken = "mock-token";

  beforeEach(() => {
    jest.clearAllMocks();

    (useWebSocketStore as unknown as jest.Mock).mockReturnValue({
      initializeContractService: mockInitializeContractService,
      requestContractPrice: mockRequestContractPrice,
      cancelContractPrice: mockCancelContractPrice,
      contractPrices: {},
      isContractConnected: false,
      contractError: null
    } as MockStore);
  });

  it('should initialize contract service and request price', () => {
    renderHook(() => useContractWebSocket(mockRequest, mockAuthToken));

    expect(mockInitializeContractService).toHaveBeenCalledWith(mockAuthToken);
    expect(mockRequestContractPrice).toHaveBeenCalledWith(mockRequest);
  });

  it('should cancel price request on unmount', () => {
    const { unmount } = renderHook(() => useContractWebSocket(mockRequest, mockAuthToken));

    unmount();

    expect(mockCancelContractPrice).toHaveBeenCalledWith(mockRequest);
  });

  it('should call onPrice when price updates', () => {
    const contractKey = JSON.stringify({
      duration: mockRequest.duration,
      instrument: mockRequest.instrument,
      trade_type: mockRequest.trade_type,
      currency: mockRequest.currency,
      payout: mockRequest.payout,
      strike: mockRequest.strike
    });

    (useWebSocketStore as unknown as jest.Mock).mockReturnValue({
      initializeContractService: mockInitializeContractService,
      requestContractPrice: mockRequestContractPrice,
      cancelContractPrice: mockCancelContractPrice,
      contractPrices: { [contractKey]: mockPrice },
      isContractConnected: false,
      contractError: null
    } as MockStore);

    renderHook(() => useContractWebSocket(mockRequest, mockAuthToken, { onPrice: mockOnPrice }));

    expect(mockOnPrice).toHaveBeenCalledWith(mockPrice);
  });

  it('should call onError when error occurs', () => {
    const mockError = { error: 'Test error' };

    (useWebSocketStore as unknown as jest.Mock).mockReturnValue({
      initializeContractService: mockInitializeContractService,
      requestContractPrice: mockRequestContractPrice,
      cancelContractPrice: mockCancelContractPrice,
      contractPrices: {},
      isContractConnected: false,
      contractError: mockError
    } as MockStore);

    renderHook(() => useContractWebSocket(mockRequest, mockAuthToken, { onError: mockOnError }));

    expect(mockOnError).toHaveBeenCalledWith(mockError);
  });

  it('should call onConnect when connected', () => {
    (useWebSocketStore as unknown as jest.Mock).mockReturnValue({
      initializeContractService: mockInitializeContractService,
      requestContractPrice: mockRequestContractPrice,
      cancelContractPrice: mockCancelContractPrice,
      contractPrices: {},
      isContractConnected: true,
      contractError: null
    } as MockStore);

    renderHook(() => useContractWebSocket(mockRequest, mockAuthToken, { onConnect: mockOnConnect }));

    expect(mockOnConnect).toHaveBeenCalled();
  });

  it('should call onDisconnect when disconnected', () => {
    (useWebSocketStore as unknown as jest.Mock).mockReturnValue({
      initializeContractService: mockInitializeContractService,
      requestContractPrice: mockRequestContractPrice,
      cancelContractPrice: mockCancelContractPrice,
      contractPrices: {},
      isContractConnected: false,
      contractError: null
    } as MockStore);

    renderHook(() => useContractWebSocket(mockRequest, mockAuthToken, { onDisconnect: mockOnDisconnect }));

    expect(mockOnDisconnect).toHaveBeenCalled();
  });

  it('should return current price, connection status and error', () => {
    const contractKey = JSON.stringify({
      duration: mockRequest.duration,
      instrument: mockRequest.instrument,
      trade_type: mockRequest.trade_type,
      currency: mockRequest.currency,
      payout: mockRequest.payout,
      strike: mockRequest.strike
    });

    (useWebSocketStore as unknown as jest.Mock).mockReturnValue({
      initializeContractService: mockInitializeContractService,
      requestContractPrice: mockRequestContractPrice,
      cancelContractPrice: mockCancelContractPrice,
      contractPrices: { [contractKey]: mockPrice },
      isContractConnected: true,
      contractError: null
    } as MockStore);

    const { result } = renderHook(() => useContractWebSocket(mockRequest, mockAuthToken));

    expect(result.current).toEqual({
      price: mockPrice,
      isConnected: true,
      error: null
    });
  });

  it('should reinitialize service and request price when auth token changes', () => {
    const { rerender } = renderHook(
      ({ token }) => useContractWebSocket(mockRequest, token),
      { initialProps: { token: mockAuthToken } }
    );

    expect(mockInitializeContractService).toHaveBeenCalledWith(mockAuthToken);
    expect(mockRequestContractPrice).toHaveBeenCalledWith(mockRequest);

    const newToken = "new-token";
    rerender({ token: newToken });

    expect(mockInitializeContractService).toHaveBeenCalledWith(newToken);
    expect(mockRequestContractPrice).toHaveBeenCalledWith(mockRequest);
  });

  it('should request new price when request params change', () => {
    const { rerender } = renderHook(
      ({ request }) => useContractWebSocket(request, mockAuthToken),
      { initialProps: { request: mockRequest } }
    );

    expect(mockRequestContractPrice).toHaveBeenCalledWith(mockRequest);

    const newRequest: ContractPriceRequest = {
      ...mockRequest,
      duration: "2h"
    };

    rerender({ request: newRequest });

    expect(mockCancelContractPrice).toHaveBeenCalledWith(mockRequest);
    expect(mockRequestContractPrice).toHaveBeenCalledWith(newRequest);
  });
});
