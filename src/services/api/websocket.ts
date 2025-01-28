import { WebSocketMessage, WebSocketRequest, WebSocketEventHandler, WebSocketEventMap, WebSocketAction } from './types';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private readonly url: string;
  private readonly id: string;
  private eventHandlers: Map<keyof WebSocketEventMap, Set<WebSocketEventHandler>> = new Map();
  private activeActions: Set<WebSocketAction> = new Set();

  constructor(id: string, url?: string) {
    this.id = id;
    this.url = url || `${process.env.VITE_WS_URL || 'ws://localhost:3000'}/ws`;
    
    // Initialize event handler sets
    ['open', 'close', 'error', 'message'].forEach(event => {
      this.eventHandlers.set(event as keyof WebSocketEventMap, new Set());
    });
  }

  public connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.ws = new WebSocket(this.url);

    // Attach default handlers
    this.ws.addEventListener('open', (event) => {
      console.log(`WebSocket [${this.id}] connected`);
      this.eventHandlers.get('open')?.forEach(handler => handler(event));
    });

    this.ws.addEventListener('close', (event) => {
      console.log(`WebSocket [${this.id}] disconnected`);
      this.eventHandlers.get('close')?.forEach(handler => handler(event));
    });

    this.ws.addEventListener('error', (event) => {
      console.error(`WebSocket [${this.id}] error:`, event);
      this.eventHandlers.get('error')?.forEach(handler => handler(event));
    });

    this.ws.addEventListener('message', (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        // Create a new MessageEvent with the parsed data to match the hook's expectations
        const messageEvent = new MessageEvent('message', {
          data: JSON.stringify(message) // Keep as string to match hook's parsing expectation
        });
        this.eventHandlers.get('message')?.forEach(handler => handler(messageEvent));
      } catch (error) {
        console.error(`WebSocket [${this.id}] error parsing message:`, error);
      }
    });
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.activeActions.clear();
    }
  }

  public send(request: WebSocketRequest): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.activeActions.add(request.action);
      this.ws.send(JSON.stringify(request));
    } else {
      console.error(`WebSocket [${this.id}] is not connected`);
    }
  }

  public on(event: keyof WebSocketEventMap, handler: WebSocketEventHandler): void {
    this.eventHandlers.get(event)?.add(handler);
  }

  public off(event: keyof WebSocketEventMap, handler: WebSocketEventHandler): void {
    this.eventHandlers.get(event)?.delete(handler);
  }

  public stopAction(action: WebSocketAction): void {
    this.activeActions.delete(action);
  }

  // For testing purposes only
  public setReconnectDelay(): void {
    // No-op for now, can be implemented later if needed
  }
}

// Create instances for different streams
export const createWebSocketService = (id: string, url?: string) => {
  return new WebSocketService(id, url);
};

// Create instances for different types of data
export const marketWebSocket = createWebSocketService('market');
export const tradeWebSocket = createWebSocketService('trade');
export const accountWebSocket = createWebSocketService('account');
