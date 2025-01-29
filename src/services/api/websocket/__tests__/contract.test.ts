// Mock the API config
jest.mock('@/config/api', () => ({
  apiConfig: {
    ws: {
      baseUrl: 'wss://test.example.com'
    }
  }
}));

// Import services after mocking
import { ContractWebSocketService } from '../contract/service';
import { ContractPriceRequest, ContractPriceResponse } from '@/services/api/websocket/types';

describe('ContractWebSocketService', () => {
  let service: ContractWebSocketService;
  let mockWs: jest.Mocked<WebSocket>;
  let wsReadyState: number;
  let eventHandlers: Record<string, ((event: any) => void) | undefined>;
  const mockAuthToken = 'mock-token';

  beforeEach(() => {
    // Mock WebSocket static properties
    (global as any).WebSocket = class MockWebSocket {
      static CONNECTING = 0;
      static OPEN = 1;
      static CLOSING = 2;
      static CLOSED = 3;
    };

    wsReadyState = WebSocket.CONNECTING;
    eventHandlers = {
      open: undefined,
      close: undefined,
      error: undefined,
      message: undefined
    };

    mockWs = {
      get readyState() { return wsReadyState; },
      send: jest.fn(),
      close: jest.fn(),
      addEventListener: jest.fn().mockImplementation((event: string, handler: (event: any) => void) => {
        eventHandlers[event] = handler;
      }),
      removeEventListener: jest.fn(),
    } as any;

    // Mock WebSocket constructor
    (global as any).WebSocket = jest.fn().mockImplementation(() => mockWs);
    
    service = new ContractWebSocketService(mockAuthToken);
  });

  afterEach(() => {
    service.disconnect();
    jest.clearAllMocks();
  });

  const connectWebSocket = () => {
    service.connect();
    wsReadyState = WebSocket.OPEN;
    if (eventHandlers.open) {
      eventHandlers.open({});
    }
  };

  it('should connect with auth token as protocol', () => {
    connectWebSocket();

    expect(global.WebSocket).toHaveBeenCalledWith('wss://test.example.com/', ['Bearer.mock-token']);
    expect(mockWs.addEventListener).toHaveBeenCalledWith('open', expect.any(Function));
    expect(mockWs.addEventListener).toHaveBeenCalledWith('close', expect.any(Function));
    expect(mockWs.addEventListener).toHaveBeenCalledWith('error', expect.any(Function));
    expect(mockWs.addEventListener).toHaveBeenCalledWith('message', expect.any(Function));
  });

  it('should handle contract price updates', () => {
    connectWebSocket();
    const mockHandler = jest.fn();
    const mockData: ContractPriceResponse = {
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

    service.on('contract_price', mockHandler);

    // Simulate receiving a message
    if (eventHandlers.message) {
      eventHandlers.message({
        data: JSON.stringify({
          action: 'contract_price',
          data: mockData
        })
      });
    }

    expect(mockHandler).toHaveBeenCalledWith(mockData);
  });

  it('should track active contracts and resubscribe after reconnect', () => {
    connectWebSocket();

    const request: ContractPriceRequest = {
      duration: "1h",
      instrument: "R_100",
      trade_type: "CALL",
      currency: "USD",
      payout: "100"
    };

    service.requestPrice(request);
    expect(mockWs.send).toHaveBeenCalledWith(
      JSON.stringify({
        action: 'contract_price',
        data: request
      })
    );

    // Clear previous send calls
    (mockWs.send as jest.Mock).mockClear();

    // Simulate disconnect and reconnect
    service.disconnect();
    wsReadyState = WebSocket.CONNECTING;
    service.connect();
    wsReadyState = WebSocket.OPEN;
    if (eventHandlers.open) {
      eventHandlers.open({});
    }

    // Should resubscribe automatically
    expect(mockWs.send).toHaveBeenCalledWith(
      JSON.stringify({
        action: 'contract_price',
        data: request
      })
    );
  });

  it('should handle connection errors', () => {
    connectWebSocket();
    const mockErrorHandler = jest.fn();
    service.onError(mockErrorHandler);

    // Simulate an error
    if (eventHandlers.error) {
      eventHandlers.error(new Event('error'));
    }

    expect(mockErrorHandler).toHaveBeenCalledWith({ error: 'WebSocket connection error' });
  });

  it('should handle invalid messages', () => {
    connectWebSocket();
    const mockErrorHandler = jest.fn();
    service.onError(mockErrorHandler);

    // Simulate receiving an invalid message
    if (eventHandlers.message) {
      eventHandlers.message({ data: 'invalid json' });
    }

    expect(mockErrorHandler).toHaveBeenCalledWith({ error: 'Failed to parse WebSocket message' });
  });

  it('should handle server errors', () => {
    connectWebSocket();
    const mockErrorHandler = jest.fn();
    service.onError(mockErrorHandler);

    // Simulate receiving a server error
    if (eventHandlers.message) {
      eventHandlers.message({
        data: JSON.stringify({
          error: { error: 'Server error' }
        })
      });
    }

    expect(mockErrorHandler).toHaveBeenCalledWith({ error: 'Server error' });
  });

  it('should not send messages when disconnected', () => {
    connectWebSocket();
    const mockErrorHandler = jest.fn();
    service.onError(mockErrorHandler);

    // First set the state to CLOSED, then disconnect
    wsReadyState = WebSocket.CLOSED;
    service.disconnect();

    const request: ContractPriceRequest = {
      duration: "1h",
      instrument: "R_100",
      trade_type: "CALL",
      currency: "USD",
      payout: "100"
    };

    service.requestPrice(request);
    expect(mockErrorHandler).toHaveBeenCalledWith({ error: 'WebSocket is not connected' });
    expect(mockWs.send).not.toHaveBeenCalled();
  });

  it('should remove contract from active contracts when cancelled', () => {
    connectWebSocket();

    const request: ContractPriceRequest = {
      duration: "1h",
      instrument: "R_100",
      trade_type: "CALL",
      currency: "USD",
      payout: "100"
    };

    service.requestPrice(request);
    expect(service['activeContracts'].size).toBe(1);

    service.cancelPrice(request);
    expect(service['activeContracts'].size).toBe(0);
  });

  it('should handle multiple contract subscriptions', () => {
    connectWebSocket();

    const requests: ContractPriceRequest[] = [
      {
        duration: "1h",
        instrument: "R_100",
        trade_type: "CALL",
        currency: "USD",
        payout: "100"
      },
      {
        duration: "2h",
        instrument: "R_200",
        trade_type: "PUT",
        currency: "USD",
        payout: "200"
      }
    ];

    requests.forEach(request => service.requestPrice(request));
    expect(service['activeContracts'].size).toBe(2);

    // Clear previous send calls
    (mockWs.send as jest.Mock).mockClear();

    // Simulate disconnect and reconnect
    service.disconnect();
    wsReadyState = WebSocket.CONNECTING;
    service.connect();
    wsReadyState = WebSocket.OPEN;
    if (eventHandlers.open) {
      eventHandlers.open({});
    }

    // Should resubscribe to all contracts
    expect(service['activeContracts'].size).toBe(2);
    expect(mockWs.send).toHaveBeenCalledTimes(2);
    requests.forEach(request => {
      expect(mockWs.send).toHaveBeenCalledWith(
        JSON.stringify({
          action: 'contract_price',
          data: request
        })
      );
    });
  });
});
