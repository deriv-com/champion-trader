import { WebSocketOptions, MessageHandler } from "./types";
import {
  WebSocketMessage,
  WebSocketAction,
  WebSocketMessageMap,
  WebSocketError,
} from "@/services/api/websocket/types";

export abstract class BaseWebSocketService<T extends WebSocketMessageMap> {
  protected ws: WebSocket | null = null;
  protected messageHandlers = new Map<keyof T, Set<MessageHandler<any>>>();
  protected errorHandlers = new Set<(error: WebSocketError) => void>();
  protected reconnectCount = 0;
  protected headerOptions: WebSocketOptions = {};
  private wsHandlers: {
    open: ((event: Event) => void) | null;
    close: ((event: CloseEvent) => void) | null;
    error: ((event: Event) => void) | null;
    message: ((event: MessageEvent) => void) | null;
  } = {
    open: null,
    close: null,
    error: null,
    message: null,
  };

  constructor(protected readonly options: WebSocketOptions) {
    this.headerOptions = { ...options };
  }

  public connect(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return;

    const url = new URL(this.getWebSocketUrl());

    // If we have an Authorization header, add it as a query parameter
    if (this.headerOptions?.headers?.Authorization) {
      url.searchParams.append('Authorization', this.headerOptions?.headers?.Authorization);
    }
    this.ws = new WebSocket(url.toString());

    // Set up event handlers
    this.setupEventHandlers();
  }

  protected abstract getWebSocketUrl(): string;

  public disconnect(): void {
    if (!this.ws) return;

    // First close the connection
    this.ws.close();

    // Remove all event listeners
    if (this.wsHandlers.open) {
      this.ws.removeEventListener("open", this.wsHandlers.open);
    }
    if (this.wsHandlers.close) {
      this.ws.removeEventListener("close", this.wsHandlers.close);
    }
    if (this.wsHandlers.error) {
      this.ws.removeEventListener("error", this.wsHandlers.error);
    }
    if (this.wsHandlers.message) {
      this.ws.removeEventListener("message", this.wsHandlers.message);
    }

    // Clear the WebSocket instance and handlers
    this.ws = null;
    this.wsHandlers = {
      open: null,
      close: null,
      error: null,
      message: null,
    };
    this.reconnectCount = 0;
  }

  public on<K extends keyof T & WebSocketAction>(
    action: K,
    handler: MessageHandler<T[K]["response"]>
  ): void {
    if (!this.messageHandlers.has(action)) {
      this.messageHandlers.set(action, new Set());
    }
    this.messageHandlers.get(action)?.add(handler);
  }

  public off<K extends keyof T & WebSocketAction>(
    action: K,
    handler: MessageHandler<T[K]["response"]>
  ): void {
    this.messageHandlers.get(action)?.delete(handler);
  }

  public onError(handler: (error: WebSocketError) => void): void {
    this.errorHandlers.add(handler);
  }

  public offError(handler: (error: WebSocketError) => void): void {
    this.errorHandlers.delete(handler);
  }

  protected send<K extends keyof T & WebSocketAction>(
    action: K,
    data: T[K]["request"]
  ): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.handleError({ error: "WebSocket is not connected" });
      return;
    }

    const message: WebSocketMessage = { action, data };
    this.ws.send(JSON.stringify(message));
  }

  protected setupEventHandlers(): void {
    if (!this.ws) return;

    this.wsHandlers.open = (_event: Event) => {
      console.log("WebSocket connected");
      this.reconnectCount = 0;
      this.options.onOpen?.();
    };

    this.wsHandlers.close = (_event: CloseEvent) => {
      console.log("WebSocket disconnected");
      this.options.onClose?.();
      this.handleReconnect();
    };

    this.wsHandlers.error = (error: Event) => {
      console.log("WebSocket error:", error);
      this.options.onError?.(error);
      this.handleError({ error: "WebSocket connection error" });
    };

    this.wsHandlers.message = (event: MessageEvent) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);

        if (message.error) {
          this.handleError(message.error);
          return;
        }

        this.handleMessage(message);
      } catch (error) {
        console.log("Error parsing WebSocket message:", error);
        this.handleError({ error: "Failed to parse WebSocket message" });
      }
    };

    this.ws.addEventListener("open", this.wsHandlers.open);
    this.ws.addEventListener("close", this.wsHandlers.close);
    this.ws.addEventListener("error", this.wsHandlers.error);
    this.ws.addEventListener("message", this.wsHandlers.message);
  }

  protected handleError(error: WebSocketError): void {
    console.log("WebSocket error:", error);
    this.errorHandlers.forEach((handler) => handler(error));
  }

  private handleReconnect(): void {
    if (
      this.options.reconnectAttempts &&
      this.reconnectCount >= this.options.reconnectAttempts
    ) {
      console.log("Max reconnection attempts reached");
      return;
    }

    const delay = this.options.reconnectInterval || 5000;
    console.log(`Reconnecting in ${delay}ms...`);

    setTimeout(() => {
      this.reconnectCount++;
      this.connect();
    }, delay);
  }

  protected abstract handleMessage(message: WebSocketMessage): void;
}
