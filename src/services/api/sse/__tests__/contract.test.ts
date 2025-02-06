import { ContractSSEService } from '../contract/service';
import { ContractPriceRequest, ContractPriceResponse } from '@/services/api/websocket/types';
import { apiConfig } from '@/config/api';

// Mock EventSource
class MockEventSource {
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onopen: (() => void) | null = null;
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  close() {}
}

global.EventSource = MockEventSource as any;

describe('ContractSSEService', () => {
  let service: ContractSSEService;
  let mockEventSource: MockEventSource | null;
  const mockAuthToken = 'test-auth-token';

  beforeEach(() => {
    jest.useFakeTimers();
    service = new ContractSSEService(mockAuthToken);
    mockEventSource = null;
  });

  afterEach(() => {
    jest.useRealTimers();
    service.disconnect();
  });

  const createMockRequest = (): ContractPriceRequest => ({
    duration: '1m',
    instrument: 'R_100',
    trade_type: 'CALL',
    currency: 'USD',
    payout: '100',
    strike: '1234.56'
  });

  const createMockResponse = (request: ContractPriceRequest): ContractPriceResponse => ({
    date_start: 1738841771212,
    date_expiry: 1738841831212,
    spot: '1234.56',
    strike: request.strike || '1234.56',
    price: '5.67',
    trade_type: request.trade_type,
    instrument: request.instrument,
    currency: request.currency,
    payout: request.payout,
    pricing_parameters: {
      volatility: '0.5',
      duration_in_years: '0.00190259'
    }
  });

  it('should handle connection states correctly', () => {
    const request = createMockRequest();
    service.requestPrice(request);
    mockEventSource = (service as any).eventSource;

    expect((service as any).isConnecting).toBe(true);

    if (mockEventSource?.onopen) {
      mockEventSource.onopen();
    }

    expect((service as any).isConnecting).toBe(false);
  });

  it('should request contract price with auth token', () => {
    const request = createMockRequest();
    service.requestPrice(request);
    mockEventSource = (service as any).eventSource;

    const expectedUrl = new URL(`${apiConfig.sse.baseUrl}${apiConfig.sse.protectedPath}`);
    expectedUrl.searchParams.append('action', 'contract_price');
    Object.entries(request).forEach(([key, value]) => {
      expectedUrl.searchParams.append(key, value.toString());
    });

    expect(mockEventSource?.url).toBe(expectedUrl.toString());
  });

  it('should handle contract price updates', () => {
    const mockHandler = jest.fn();
    const request = createMockRequest();
    const mockResponse = createMockResponse(request);

    service.on('contract_price', mockHandler);
    service.requestPrice(request);
    mockEventSource = (service as any).eventSource;

    if (mockEventSource?.onmessage) {
      mockEventSource.onmessage(new MessageEvent('message', {
        data: JSON.stringify({
          action: 'contract_price',
          data: mockResponse
        })
      }));
    }

    expect(mockHandler).toHaveBeenCalledWith({
      action: 'contract_price',
      data: mockResponse
    });
  });

  it('should handle parse errors', () => {
    const mockErrorHandler = jest.fn();
    const request = createMockRequest();

    service.onError(mockErrorHandler);
    service.requestPrice(request);
    mockEventSource = (service as any).eventSource;

    if (mockEventSource?.onmessage) {
      mockEventSource.onmessage(new MessageEvent('message', {
        data: 'invalid json'
      }));
    }

    expect(mockErrorHandler).toHaveBeenCalledWith({ error: 'Failed to parse SSE message' });
  });

  it('should cancel contract price subscription', () => {
    const request = createMockRequest();
    const disconnectSpy = jest.spyOn(service, 'disconnect');

    service.requestPrice(request);
    service.cancelPrice(request);

    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('should handle multiple contract requests', () => {
    const request1 = createMockRequest();
    const request2 = { ...createMockRequest(), duration: '2m' };

    service.requestPrice(request1);
    service.requestPrice(request2);
    mockEventSource = (service as any).eventSource;

    const expectedUrl = new URL(`${apiConfig.sse.baseUrl}${apiConfig.sse.protectedPath}`);
    expectedUrl.searchParams.append('action', 'contract_price');
    [request1, request2].forEach(request => {
      Object.entries(request).forEach(([key, value]) => {
        expectedUrl.searchParams.append(key, value.toString());
      });
    });

    expect(mockEventSource?.url).toBe(expectedUrl.toString());
  });

  it('should reconnect with active contracts after error', () => {
    const request = createMockRequest();
    const connectSpy = jest.spyOn(service, 'connect');
    const mockErrorHandler = jest.fn();
    service.onError(mockErrorHandler);

    service.requestPrice(request);
    mockEventSource = (service as any).eventSource;

    // Initial connection
    expect((service as any).reconnectCount).toBe(0);

    // Trigger error to start reconnection
    if (mockEventSource?.onerror) {
      mockEventSource.onerror(new Event('error'));
    }

    // Verify error handler was called
    expect(mockErrorHandler).toHaveBeenCalledWith({ error: 'SSE connection error' });

    // Fast-forward timers to trigger reconnection
    jest.advanceTimersByTime(1000);

    // Verify reconnection attempt
    expect(connectSpy).toHaveBeenCalledTimes(1); 

    // Verify contract request and auth token are maintained
    const expectedUrl = new URL(`${apiConfig.sse.baseUrl}${apiConfig.sse.protectedPath}`);
    expectedUrl.searchParams.append('action', 'contract_price');
    Object.entries(request).forEach(([key, value]) => {
      expectedUrl.searchParams.append(key, value.toString());
    });
    expect((service as any).eventSource.url).toBe(expectedUrl.toString());
  });

  it('should reset reconnect count on successful connection', () => {
    const request = createMockRequest();
    service.requestPrice(request);
    mockEventSource = (service as any).eventSource;

    // Trigger error to start reconnection
    if (mockEventSource?.onerror) {
      mockEventSource.onerror(new Event('error'));
    }

    // Fast-forward timers to trigger reconnection
    jest.advanceTimersByTime(1000);

    // Simulate successful connection
    if (mockEventSource?.onopen) {
      mockEventSource.onopen();
    }

    expect((service as any).reconnectCount).toBe(0);
  });

  it('should maintain active contracts across reconnections', () => {
    const request1 = createMockRequest();
    const request2 = { ...createMockRequest(), duration: '2m' };

    service.requestPrice(request1);
    service.requestPrice(request2);
    mockEventSource = (service as any).eventSource;

    // Trigger error to start reconnection
    if (mockEventSource?.onerror) {
      mockEventSource.onerror(new Event('error'));
    }

    // Fast-forward timers to trigger reconnection
    jest.advanceTimersByTime(1000);

    // Verify contracts and auth token are maintained
    const expectedUrl = new URL(`${apiConfig.sse.baseUrl}${apiConfig.sse.protectedPath}`);
    expectedUrl.searchParams.append('action', 'contract_price');
    [request1, request2].forEach(request => {
      Object.entries(request).forEach(([key, value]) => {
        expectedUrl.searchParams.append(key, value.toString());
      });
    });
    expect((service as any).eventSource.url).toBe(expectedUrl.toString());
  });

  it('should update auth token and maintain it across reconnections', () => {
    const newToken = 'new-auth-token';
    const request = createMockRequest();

    service.requestPrice(request);
    service.updateAuthToken(newToken);
    mockEventSource = (service as any).eventSource;

    // Trigger error to start reconnection
    if (mockEventSource?.onerror) {
      mockEventSource.onerror(new Event('error'));
    }

    // Fast-forward timers to trigger reconnection
    jest.advanceTimersByTime(1000);

    // Verify new token is maintained after reconnection
    const expectedUrl = new URL(`${apiConfig.sse.baseUrl}${apiConfig.sse.protectedPath}`);
    expectedUrl.searchParams.append('action', 'contract_price');
    Object.entries(request).forEach(([key, value]) => {
      expectedUrl.searchParams.append(key, value.toString());
    });
    expect((service as any).eventSource.url).toBe(expectedUrl.toString());
  });
});
