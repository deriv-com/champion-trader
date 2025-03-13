import { CustomEventSource } from "./custom-event-source";
import { apiConfig } from "@/config/api";
import { connectionManager } from "./connection-manager";

interface SSEOptions {
    params: Record<string, string>;
    headers?: Record<string, string>;
    onMessage: (data: any) => void;
    onError?: (error: any) => void;
    onOpen?: () => void;
    reconnectAttempts?: number;
    reconnectInterval?: number;
    customPath?: string; // Add support for custom endpoint paths
}

/**
 * Creates an SSE connection with proper connection management.
 * IMPORTANT: Always import this function from '@/api/base/sse', never directly from this file.
 *
 * @param options Connection options including parameters, callbacks, reconnection settings, and custom path
 * @returns A cleanup function that closes the connection and removes it from the manager
 */
export const createSSEConnection = (options: SSEOptions) => {
    const {
        params,
        headers,
        onMessage,
        onError,
        onOpen,
        reconnectAttempts = 3,
        reconnectInterval = 1000,
        customPath,
    } = options;

    let eventSource: CustomEventSource | null = null;
    let attemptCount = 0;
    let isDestroyed = false;

    const connect = () => {
        if (isDestroyed) return;

        // Construct full URL using apiConfig
        const baseUrl = apiConfig.sse.baseUrl;
        const sseUrl = new URL(baseUrl);

        // Use customPath if provided, otherwise use the default public path
        sseUrl.pathname = customPath || apiConfig.sse.publicPath;

        // Add query parameters
        sseUrl.search = new URLSearchParams(params).toString();

        eventSource = new CustomEventSource(sseUrl.toString(), { headers });

        eventSource.onmessage = (event) => {
            try {
                const rawMessage = event.data;
                let jsonString = rawMessage;

                if (typeof rawMessage === "string" && rawMessage.includes("data:")) {
                    const lines = rawMessage.split("\n");
                    const dataLine = lines.find((line: string) => line.startsWith("data:"));
                    if (!dataLine) {
                        throw new Error('No "data:" field found in the message');
                    }
                    jsonString = dataLine.replace("data: ", "").trim();
                }

                const data = JSON.parse(jsonString);
                onMessage(data);
                attemptCount = 0; // Reset attempt count on successful message
            } catch (error) {
                onError?.(error);
            }
        };

        eventSource.onerror = (error) => {
            onError?.(error);

            // Attempt reconnection
            if (attemptCount < reconnectAttempts) {
                attemptCount++;
                setTimeout(() => {
                    eventSource?.close();
                    connect();
                }, reconnectInterval);
            }
        };

        eventSource.onopen = () => {
            attemptCount = 0; // Reset attempt count on successful connection
            onOpen?.();
        };
    };

    connect();

    // Create a cleanup function
    const cleanup = () => {
        isDestroyed = true;
        eventSource?.close();
    };

    // Get the full URL for registration with the connection manager
    const fullUrl = new URL(apiConfig.sse.baseUrl);
    // Use the same path for registration that was used for the connection
    fullUrl.pathname = customPath || apiConfig.sse.publicPath;

    // Register with connection manager and return the wrapped cleanup function
    return connectionManager.register(fullUrl.toString(), cleanup);
};
