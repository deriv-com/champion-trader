import { createSSEConnection } from "../client";
import { connectionManager } from "../connection-manager";
import { CustomEventSource } from "../custom-event-source";
import { apiConfig } from "@/config/api";

// Mock the CustomEventSource
jest.mock("../custom-event-source");

// Mock the apiConfig
jest.mock("@/config/api", () => ({
    apiConfig: {
        sse: {
            baseUrl: "https://test-api.example.com",
            publicPath: "/stream",
        },
    },
}));

describe("SSE Client", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset connection manager
        connectionManager.reset();

        // Mock implementation for CustomEventSource
        (CustomEventSource as jest.Mock).mockImplementation(function (this: any) {
            this.close = jest.fn();
            this.onmessage = null;
            this.onerror = null;
            this.onopen = null;
            return this;
        });
    });

    test("should create a new SSE connection", () => {
        const onMessage = jest.fn();
        const onError = jest.fn();
        const onOpen = jest.fn();

        createSSEConnection({
            params: { stream: "price", symbol: "EURUSD" },
            onMessage,
            onError,
            onOpen,
        });

        expect(CustomEventSource).toHaveBeenCalledTimes(1);
        expect(connectionManager.getConnectionCount()).toBe(1);
    });

    test("should close existing connection when creating a new one for the same endpoint", () => {
        // Create first connection
        const onMessage1 = jest.fn();
        createSSEConnection({
            params: { stream: "price", symbol: "EURUSD" },
            onMessage: onMessage1,
        });

        // Get the instance of the first CustomEventSource
        const firstInstance = (CustomEventSource as jest.Mock).mock.instances[0];

        // Create second connection to the same endpoint but with different params
        const onMessage2 = jest.fn();
        createSSEConnection({
            params: { stream: "price", symbol: "GBPUSD" },
            onMessage: onMessage2,
        });

        // Verify the first connection's close method was called
        expect(firstInstance.close).toHaveBeenCalledTimes(1);

        // Verify we only have one active connection
        expect(connectionManager.getConnectionCount()).toBe(1);
    });

    test("should not close connections to different endpoints", () => {
        // Save original publicPath
        const originalPublicPath = apiConfig.sse.publicPath;

        try {
            // Mock different paths for each connection
            apiConfig.sse.publicPath = "/stream1";

            // Create first connection
            const onMessage1 = jest.fn();
            createSSEConnection({
                params: { stream: "price" },
                onMessage: onMessage1,
            });

            // Get the instance of the first CustomEventSource
            const firstInstance = (CustomEventSource as jest.Mock).mock.instances[0];

            // Change path for second connection
            apiConfig.sse.publicPath = "/stream2";

            // Create second connection to a different endpoint
            const onMessage2 = jest.fn();
            createSSEConnection({
                params: { stream: "balance" },
                onMessage: onMessage2,
            });

            // Verify the first connection's close method was not called
            expect(firstInstance.close).not.toHaveBeenCalled();

            // Verify we have two active connections
            expect(connectionManager.getConnectionCount()).toBe(2);
        } finally {
            // Restore original publicPath
            apiConfig.sse.publicPath = originalPublicPath;
        }
    });

    test("should properly clean up connection when cleanup function is called", () => {
        // Create a connection
        const onMessage = jest.fn();
        const cleanup = createSSEConnection({
            params: { stream: "price" },
            onMessage,
        });

        // Get the instance of the CustomEventSource
        const instance = (CustomEventSource as jest.Mock).mock.instances[0];

        // Call the cleanup function
        cleanup();

        // Verify the connection was closed
        expect(instance.close).toHaveBeenCalledTimes(1);

        // Verify the connection was removed from the manager
        expect(connectionManager.getConnectionCount()).toBe(0);
    });

    test("should use customPath when provided", () => {
        // Create a connection with a custom path
        const onMessage = jest.fn();
        const customPath = "/v1/accounting/balance/stream";

        createSSEConnection({
            params: { account_uuid: "12345" },
            onMessage,
            customPath,
        });

        // Verify the CustomEventSource was created with the correct URL
        const url = (CustomEventSource as jest.Mock).mock.calls[0][0];
        expect(url).toContain(customPath);

        // Check that it's using the custom path and not the default path
        // We need to check the exact pathname to avoid false negatives when
        // the custom path contains the default path as a substring
        const urlObj = new URL(url);
        expect(urlObj.pathname).toBe(customPath);
    });

    test("should use default publicPath when customPath is not provided", () => {
        // Create a connection without a custom path
        const onMessage = jest.fn();

        createSSEConnection({
            params: { stream: "price" },
            onMessage,
        });

        // Verify the CustomEventSource was created with the default path
        const url = (CustomEventSource as jest.Mock).mock.calls[0][0];
        expect(url).toContain(apiConfig.sse.publicPath);
    });

    test("should treat connections with different customPaths as different connections", () => {
        // Create first connection with a custom path
        const onMessage1 = jest.fn();
        const customPath1 = "/v1/accounting/balance/stream";

        createSSEConnection({
            params: { account_uuid: "12345" },
            onMessage: onMessage1,
            customPath: customPath1,
        });

        // Get the instance of the first CustomEventSource
        const firstInstance = (CustomEventSource as jest.Mock).mock.instances[0];

        // Create second connection with a different custom path
        const onMessage2 = jest.fn();
        const customPath2 = "/v1/trading/price/stream";

        createSSEConnection({
            params: { symbol: "EURUSD" },
            onMessage: onMessage2,
            customPath: customPath2,
        });

        // Verify the first connection's close method was not called
        // (because they are different endpoints due to different customPaths)
        expect(firstInstance.close).not.toHaveBeenCalled();

        // Verify we have two active connections
        expect(connectionManager.getConnectionCount()).toBe(2);
    });

    test("should close existing connection when creating a new one with the same customPath", () => {
        // Create first connection with a custom path
        const onMessage1 = jest.fn();
        const customPath = "/v1/accounting/balance/stream";

        createSSEConnection({
            params: { account_uuid: "12345" },
            onMessage: onMessage1,
            customPath,
        });

        // Get the instance of the first CustomEventSource
        const firstInstance = (CustomEventSource as jest.Mock).mock.instances[0];

        // Create second connection with the same custom path but different params
        const onMessage2 = jest.fn();

        createSSEConnection({
            params: { account_uuid: "67890" },
            onMessage: onMessage2,
            customPath,
        });

        // Verify the first connection's close method was called
        expect(firstInstance.close).toHaveBeenCalledTimes(1);

        // Verify we only have one active connection
        expect(connectionManager.getConnectionCount()).toBe(1);
    });
});
