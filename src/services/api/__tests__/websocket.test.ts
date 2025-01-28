import { WebSocketService } from '../websocket';
import { WebSocketMessage, WebSocketRequest } from '../types';

class MockWebSocket {
  public readyState: number = WebSocket.CONNECTING;
  private handlers: Record<string, Function[]> = {
    open: [],
    close: [],
    error: [],
    message: []
  };
  public send = jest.fn();
  public close = jest.fn(() => {
    this.readyState = WebSocket.CLOSED;
    this.triggerEvent('close', new CloseEvent('close'));
  });

  constructor() {
    this.readyState = WebSocket.OPEN;
  }

  addEventListener = jest.fn((event: string, handler: Function) => {
    this.handlers[event].push(handler);
  });

  removeEventListener = jest.fn((event: string, handler: Function) => {
    const index = this.handlers[event].indexOf(handler);
    if (index > -1) {
      this.handlers[event].splice(index, 1);
    }
  });

  triggerEvent(event: string, data: any) {
    this.handlers[event].forEach(handler => handler(data));
  }
}

describe('WebSocketService', () => {
  let service: WebSocketService;
  let mockWs: MockWebSocket;
  const TEST_URL = 'ws://test-server/ws';

  beforeEach(() => {
    mockWs = new MockWebSocket();
    const originalWebSocket = global.WebSocket;
    const mockWebSocketConstructor = jest.fn(() => mockWs);
    // Preserve the original WebSocket static properties
    Object.defineProperties(mockWebSocketConstructor, {
      CONNECTING: { value: originalWebSocket.CONNECTING },
      OPEN: { value: originalWebSocket.OPEN },
      CLOSING: { value: originalWebSocket.CLOSING },
      CLOSED: { value: originalWebSocket.CLOSED }
    });
    global.WebSocket = mockWebSocketConstructor as unknown as typeof WebSocket;
    service = new WebSocketService('test', TEST_URL);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should connect to WebSocket server', async () => {
    service.connect();
    expect(global.WebSocket).toHaveBeenCalledWith(TEST_URL);
    expect(mockWs.addEventListener).toHaveBeenCalledWith('open', expect.any(Function));
    expect(mockWs.addEventListener).toHaveBeenCalledWith('close', expect.any(Function));
    expect(mockWs.addEventListener).toHaveBeenCalledWith('error', expect.any(Function));
    expect(mockWs.addEventListener).toHaveBeenCalledWith('message', expect.any(Function));

    // Simulate successful connection
    mockWs.triggerEvent('open', new Event('open'));
  });

  it('should handle sending messages', async () => {
    service.connect();
    mockWs.readyState = WebSocket.OPEN;
    mockWs.triggerEvent('open', new Event('open'));

    const request: WebSocketRequest = {
      action: 'instrument_price',
      data: { symbol: 'BTCUSD' }
    };

    service.send(request);
    expect(mockWs.send).toHaveBeenCalledWith(JSON.stringify(request));
  });

  it('should handle message events', async () => {
    service.connect();
    mockWs.readyState = WebSocket.OPEN;
    mockWs.triggerEvent('open', new Event('open'));

    const mockHandler = jest.fn();
    const testMessage: WebSocketMessage = {
      action: 'instrument_price',
      data: { price: 100, symbol: 'BTCUSD', timestamp: '2025-01-28T12:00:00Z' }
    };

    service.on('message', mockHandler);
    mockWs.triggerEvent('message', new MessageEvent('message', { 
      data: JSON.stringify(testMessage)
    }));

    expect(mockHandler).toHaveBeenCalledWith(expect.any(MessageEvent));
  });

  it('should handle connection state', async () => {
    const openHandler = jest.fn();
    const closeHandler = jest.fn();

    service.on('open', openHandler);
    service.on('close', closeHandler);
    service.connect();
    mockWs.readyState = WebSocket.OPEN;

    // Simulate connection events
    mockWs.triggerEvent('open', new Event('open'));
    expect(openHandler).toHaveBeenCalled();

    mockWs.readyState = WebSocket.CLOSED;
    mockWs.close();
    expect(closeHandler).toHaveBeenCalled();
  });

  it('should clean up on disconnect', async () => {
    service.connect();
    mockWs.readyState = WebSocket.OPEN;
    mockWs.triggerEvent('open', new Event('open'));

    service.disconnect();
    expect(mockWs.close).toHaveBeenCalled();
    expect(mockWs.readyState).toBe(WebSocket.CLOSED);

    // Try to send after disconnect
    const request: WebSocketRequest = {
      action: 'instrument_price',
      data: { symbol: 'BTCUSD' }
    };
    service.send(request);
    expect(mockWs.send).not.toHaveBeenCalled();
  });

  it('should track active actions', async () => {
    service.connect();
    mockWs.readyState = WebSocket.OPEN;
    mockWs.triggerEvent('open', new Event('open'));

    const request: WebSocketRequest = {
      action: 'instrument_price',
      data: { symbol: 'BTCUSD' }
    };

    service.send(request);
    service.stopAction('instrument_price');

    // Send another message
    service.send(request);
    expect(mockWs.send).toHaveBeenCalledTimes(2);
  });
});
