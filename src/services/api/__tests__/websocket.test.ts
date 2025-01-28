import { WebSocketService } from '../websocket';
import { WebSocketMessage, WebSocketSubscription } from '../types';

// Mock WebSocket
class MockWebSocket {
  private handlers: { [key: string]: ((event: any) => void)[] } = {};
  public readyState: number = 1; // WebSocket.OPEN

  constructor(public url: string) {
    // Initialize handlers
    this.handlers = {
      open: [],
      close: [],
      message: [],
      error: [],
    };
  }

  addEventListener(event: string, handler: (event: any) => void) {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(handler);
  }

  removeEventListener(event: string, handler: (event: any) => void) {
    if (this.handlers[event]) {
      this.handlers[event] = this.handlers[event].filter((h) => h !== handler);
    }
  }

  send(data: string) {
    // Mock implementation
    this.triggerEvent('message', new MessageEvent('message', { data }));
  }

  close() {
    this.readyState = 3; // WebSocket.CLOSED
    this.triggerEvent('close', new CloseEvent('close'));
  }

  triggerEvent(event: string, data: any) {
    if (this.handlers[event]) {
      this.handlers[event].forEach((handler) => handler(data));
    }
  }
}

// Mock global WebSocket
const MockWebSocketClass = MockWebSocket as any;
MockWebSocketClass.CONNECTING = 0;
MockWebSocketClass.OPEN = 1;
MockWebSocketClass.CLOSING = 2;
MockWebSocketClass.CLOSED = 3;

global.WebSocket = MockWebSocketClass;

describe('WebSocketService', () => {
  let websocketService: WebSocketService;
  let mockWs: MockWebSocket;
  const testUrl = 'ws://test-server:3000/ws';

  beforeEach(async () => {
    // Reset the singleton instance
    (WebSocketService as any).instance = null;
    websocketService = WebSocketService.getInstance(testUrl);
    // Set reconnect delay to 0 for faster tests
    websocketService.setReconnectDelay(0);
    websocketService.connect();

    // Wait for the next tick to allow the WebSocket to be created
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Get the WebSocket instance
    mockWs = (websocketService as any).ws as MockWebSocket;
    
    // Simulate initial connection
    if (mockWs) {
      mockWs.triggerEvent('open', new Event('open'));
    }
  });

  afterEach(() => {
    if (websocketService) {
      websocketService.disconnect();
    }
    (WebSocketService as any).instance = null;
    jest.clearAllMocks();
  });

  it('should connect to WebSocket server', () => {
    expect(mockWs).toBeTruthy();
    expect(mockWs.url).toBe(testUrl);
    expect(mockWs.readyState).toBe(MockWebSocketClass.OPEN);
  });

  it('should handle connection events', () => {
    const openHandler = jest.fn();
    websocketService.on('open', openHandler);
    mockWs.triggerEvent('open', new Event('open'));
    expect(openHandler).toHaveBeenCalled();
  });

  it('should handle message events', () => {
    const messageHandler = jest.fn();
    websocketService.on('message', messageHandler);

    const testMessage: WebSocketMessage = {
      type: 'price',
      data: { price: 100 },
    };

    mockWs.triggerEvent(
      'message',
      new MessageEvent('message', { data: JSON.stringify(testMessage) })
    );

    expect(messageHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        data: JSON.stringify(testMessage),
      })
    );
  });

  it('should handle subscription management', () => {
    const subscription: WebSocketSubscription = {
      type: 'subscribe',
      channel: 'price',
      symbol: 'BTCUSD',
    };

    const sendSpy = jest.spyOn(mockWs, 'send');

    websocketService.subscribe(subscription);
    expect(sendSpy).toHaveBeenCalledWith(JSON.stringify({
      type: 'subscribe',
      channel: 'price',
      symbol: 'BTCUSD',
    }));

    websocketService.unsubscribe(subscription);
    expect(sendSpy).toHaveBeenCalledWith(JSON.stringify({
      type: 'unsubscribe',
      channel: 'price',
      symbol: 'BTCUSD',
    }));
  });

  it('should handle reconnection on close', async () => {
    const connectSpy = jest.spyOn(websocketService, 'connect');
    mockWs.triggerEvent('close', new CloseEvent('close'));
    
    // Wait for reconnect
    await new Promise(resolve => setTimeout(resolve, 10));
    
    expect(connectSpy).toHaveBeenCalled();
  });

  it('should resubscribe after reconnection', async () => {
    const subscription: WebSocketSubscription = {
      type: 'subscribe',
      channel: 'price',
      symbol: 'BTCUSD',
    };

    websocketService.subscribe(subscription);
    const sendSpy = jest.spyOn(mockWs, 'send');
    sendSpy.mockClear(); // Clear initial subscription call

    // Simulate disconnect and reconnect
    mockWs.triggerEvent('close', new CloseEvent('close'));
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Get the new WebSocket instance after reconnect
    mockWs = (websocketService as any).ws as MockWebSocket;
    mockWs.triggerEvent('open', new Event('open'));

    expect(sendSpy).toHaveBeenCalledWith(JSON.stringify({
      type: 'subscribe',
      channel: 'price',
      symbol: 'BTCUSD',
    }));
  });

  it('should not reconnect after max attempts', async () => {
    const maxAttempts = 5;
    const connectSpy = jest.spyOn(websocketService, 'connect');
    connectSpy.mockClear(); // Clear initial connect call

    // Simulate multiple disconnections
    for (let i = 0; i <= maxAttempts; i++) {
      mockWs.triggerEvent('close', new CloseEvent('close'));
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    expect(connectSpy).toHaveBeenCalledTimes(maxAttempts);
  });
});
