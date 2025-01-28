import {
  WebSocketEventHandler,
  WebSocketEventMap,
  WebSocketMessage,
  WebSocketSubscription,
} from './types';

export class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private readonly url: string;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // 1 second
  private eventHandlers: Map<keyof WebSocketEventMap, Set<WebSocketEventHandler>>;
  private subscriptions: Set<string> = new Set();

  private constructor(url?: string) {
    this.url = url || `${process.env.VITE_WS_URL || 'ws://localhost:3000'}/ws`;
    this.eventHandlers = new Map();
    Object.keys(this.getDefaultHandlers()).forEach((event) => {
      this.eventHandlers.set(event as keyof WebSocketEventMap, new Set());
    });
  }

  public static getInstance(url?: string): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService(url);
    }
    return WebSocketService.instance;
  }

  private getDefaultHandlers(): Record<keyof WebSocketEventMap, WebSocketEventHandler> {
    return {
      open: () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.resubscribe();
      },
      close: (event: Event | CloseEvent | MessageEvent) => {
        if (event instanceof CloseEvent) {
          console.log('WebSocket disconnected:', event.reason);
        }
        this.handleReconnect();
      },
      error: (event: Event | CloseEvent | MessageEvent) => {
        console.error('WebSocket error:', event);
      },
      message: (event: Event | CloseEvent | MessageEvent) => {
        if (event instanceof MessageEvent) {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        }
      },
    };
  }

  private handleMessage(message: WebSocketMessage): void {
    // Dispatch message to all registered handlers
    const handlers = this.eventHandlers.get('message');
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(new MessageEvent('message', { data: JSON.stringify(message) }));
        } catch (error) {
          console.error('Error in message handler:', error);
        }
      });
    }
  }

  private async handleReconnect(): Promise<void> {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      await new Promise((resolve) => setTimeout(resolve, this.reconnectDelay));
      this.connect();
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private resubscribe(): void {
    // Resubscribe to all active subscriptions after reconnect
    this.subscriptions.forEach((subscriptionKey) => {
      const [channel, symbol] = subscriptionKey.split(':');
      this.send({
        type: 'subscribe',
        channel,
        symbol: symbol || undefined,
      });
    });
  }

  public connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.ws = new WebSocket(this.url);

    // Attach default handlers
    const defaultHandlers = this.getDefaultHandlers();
    Object.entries(defaultHandlers).forEach(([event, handler]) => {
      this.ws?.addEventListener(event, handler as EventListener);
    });

    // Attach custom handlers
    this.eventHandlers.forEach((handlers, event) => {
      handlers.forEach((handler) => {
        this.ws?.addEventListener(event, handler as EventListener);
      });
    });
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public subscribe(subscription: WebSocketSubscription): void {
    const subscriptionKey = subscription.symbol
      ? `${subscription.channel}:${subscription.symbol}`
      : subscription.channel;

    if (!this.subscriptions.has(subscriptionKey)) {
      this.subscriptions.add(subscriptionKey);
      const message: WebSocketSubscription = {
        type: 'subscribe',
        channel: subscription.channel,
        symbol: subscription.symbol,
      };
      this.send(message);
    }
  }

  public unsubscribe(subscription: WebSocketSubscription): void {
    const subscriptionKey = subscription.symbol
      ? `${subscription.channel}:${subscription.symbol}`
      : subscription.channel;

    if (this.subscriptions.has(subscriptionKey)) {
      this.subscriptions.delete(subscriptionKey);
      const message: WebSocketSubscription = {
        type: 'unsubscribe',
        channel: subscription.channel,
        symbol: subscription.symbol,
      };
      this.send(message);
    }
  }

  public send(message: WebSocketMessage | WebSocketSubscription): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  public on(event: keyof WebSocketEventMap, handler: WebSocketEventHandler): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.add(handler);
      this.ws?.addEventListener(event, handler as EventListener);
    }
  }

  public off(event: keyof WebSocketEventMap, handler: WebSocketEventHandler): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
      this.ws?.removeEventListener(event, handler as EventListener);
    }
  }

  // For testing purposes only
  public setReconnectDelay(delay: number): void {
    this.reconnectDelay = delay;
  }
}

export const websocketService = WebSocketService.getInstance();
