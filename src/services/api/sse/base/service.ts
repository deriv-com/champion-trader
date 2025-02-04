import {
  SSEOptions,
  SSEMessageHandler,
  SSEErrorHandler,
  SSEMessageMap,
  SSEMessage,
} from "./types";
import { CustomEventSource } from "./custom-event-source";

export abstract class SSEService<T extends SSEMessageMap = SSEMessageMap> {
  protected eventSource: EventSource | null = null;
  protected messageHandlers: Map<keyof T, Set<SSEMessageHandler>> = new Map();
  protected errorHandlers: Set<SSEErrorHandler> = new Set();
  protected reconnectCount = 0;
  protected options: SSEOptions;
  protected isConnecting = false;

  constructor(options: SSEOptions) {
    this.options = options;
  }

  protected abstract getEndpoint(): string;

  public connect(): void {
    if (this.eventSource || this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    const endpoint = this.getEndpoint();
    this.eventSource = this.createEventSource(endpoint);

    this.eventSource.onopen = () => {
      this.isConnecting = false;
      this.reconnectCount = 0; // Reset count on successful connection

      // Notify listeners of successful connection
      const handlers = this.messageHandlers.get("open");
      if (handlers) {
        handlers.forEach((handler) => handler({}));
      }
    };

    this.eventSource.onmessage = (event: MessageEvent) => {
      try {
        const rawMessage = event.data;
        let jsonString = rawMessage;
        
        // Check if the message is in SSE format (contains "data:")
        if (typeof rawMessage === 'string' && rawMessage.includes('data:')) {
          const lines = rawMessage.split("\n");
          const dataLine = lines.find((line: string) => line.startsWith("data:"));
          if (!dataLine) {
            throw new Error('No "data:" field found in the message');
          }
          jsonString = dataLine.replace("data: ", "").trim();
        }

        const message = JSON.parse(jsonString) as SSEMessage;
        this.handleMessage(message);
      } catch (error) {
        console.error("Failed to parse SSE message: ", error);
        this.handleError({ error: "Failed to parse SSE message" });
      }
    };

    this.eventSource.onerror = (_: Event) => {
      this.isConnecting = false;

      // Increment count before checking to ensure we don't exceed max attempts
      this.reconnectCount++;

      if (this.reconnectCount >= this.options.reconnectAttempts) {
        this.handleError({ error: "Max reconnection attempts reached" });
        this.reconnectCount = 0; // Reset count before disconnecting
        this.disconnect();
      } else {
        this.handleError({ error: "SSE connection error" });
        this.reconnect();
      }
    };
  }

  public disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isConnecting = false;
    this.reconnectCount = 0;
  }

  protected reconnect(): void {
    setTimeout(() => {
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
      this.connect();
    }, this.options.reconnectInterval);
  }

  public on<K extends keyof T>(
    action: K,
    handler: SSEMessageHandler<T[K]["response"]>
  ): void {
    if (!this.messageHandlers.has(action)) {
      this.messageHandlers.set(action, new Set());
    }
    this.messageHandlers.get(action)?.add(handler);
  }

  public off<K extends keyof T>(
    action: K,
    handler: SSEMessageHandler<T[K]["response"]>
  ): void {
    this.messageHandlers.get(action)?.delete(handler);
  }

  public onError(handler: SSEErrorHandler): void {
    this.errorHandlers.add(handler);
  }

  public offError(handler: SSEErrorHandler): void {
    this.errorHandlers.delete(handler);
  }

  protected abstract handleMessage(message: SSEMessage): void;

  protected createEventSource(endpoint: string): EventSource {
    return new CustomEventSource(endpoint);
  }

  protected handleError(error: { error: string }): void {
    this.errorHandlers.forEach((handler) => handler(error));
  }
}
