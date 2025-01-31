import { BaseWebSocketService } from "./service";
import {
  WebSocketMessage,
  WebSocketMessageMap,
} from "@/services/api/websocket/types";
import { WebSocketOptions } from "./types";
import { apiConfig } from "@/config/api";

export class ProtectedWebSocketService<
  T extends WebSocketMessageMap
> extends BaseWebSocketService<T> {
  constructor(authToken: string, options: WebSocketOptions = {}) {
    super({
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${authToken}`,
      },
    });
  }

  protected getWebSocketUrl(): string {
    return `${apiConfig.ws.baseUrl}${apiConfig.ws.protectedPath}`;
  }

  protected handleMessage(message: WebSocketMessage): void {
    // Default implementation - can be overridden by derived classes
    const handlers = this.messageHandlers.get(message.action);
    handlers?.forEach((handler) => handler(message.data));
  }
}
