import { BaseWebSocketService } from "./service";
import { WebSocketMessage, WebSocketMessageMap } from "@/services/api/websocket/types";
import { WebSocketOptions } from "./types";
import { apiConfig } from "@/config/api";

export class PublicWebSocketService<T extends WebSocketMessageMap> extends BaseWebSocketService<T> {
    constructor(options: WebSocketOptions = {}) {
        super(options);
    }

    protected getWebSocketUrl(): string {
        return `${apiConfig.ws.baseUrl}${apiConfig.ws.publicPath}`;
    }

    protected handleMessage(message: WebSocketMessage): void {
        // Default implementation - can be overridden by derived classes
        const handlers = this.messageHandlers.get(message.action);
        handlers?.forEach((handler) => handler(message.data));
    }
}
