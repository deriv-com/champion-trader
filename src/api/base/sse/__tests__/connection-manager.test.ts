import { connectionManager } from "../connection-manager";

describe("SSE Connection Manager", () => {
    beforeEach(() => {
        // Reset the connection manager before each test
        connectionManager.reset();
    });

    test("should register a new connection", () => {
        const cleanup = jest.fn();
        const url = "https://example.com/stream";

        connectionManager.register(url, cleanup);

        expect(connectionManager.getConnectionCount()).toBe(1);
    });

    test("should close existing connection when registering a new one with the same base URL", () => {
        const cleanup1 = jest.fn();
        const cleanup2 = jest.fn();
        const url1 = "https://example.com/stream?param1=value1";
        const url2 = "https://example.com/stream?param2=value2";

        connectionManager.register(url1, cleanup1);
        connectionManager.register(url2, cleanup2);

        expect(cleanup1).toHaveBeenCalledTimes(1);
        expect(connectionManager.getConnectionCount()).toBe(1);
    });

    test("should not close connections with different base URLs", () => {
        const cleanup1 = jest.fn();
        const cleanup2 = jest.fn();
        const url1 = "https://example.com/stream1";
        const url2 = "https://example.com/stream2";

        connectionManager.register(url1, cleanup1);
        connectionManager.register(url2, cleanup2);

        expect(cleanup1).not.toHaveBeenCalled();
        expect(connectionManager.getConnectionCount()).toBe(2);
    });

    test("should remove connection when cleanup is called", () => {
        const cleanup = jest.fn();
        const url = "https://example.com/stream";

        const wrappedCleanup = connectionManager.register(url, cleanup);
        wrappedCleanup();

        expect(cleanup).toHaveBeenCalledTimes(1);
        expect(connectionManager.getConnectionCount()).toBe(0);
    });

    test("should handle URLs with different query parameters as the same base URL", () => {
        const cleanup1 = jest.fn();
        const cleanup2 = jest.fn();

        // URLs with the same base but different query parameters
        const url1 = "https://api.example.com/v1/accounting/balance/stream?account_uuid=demo1";
        const url2 = "https://api.example.com/v1/accounting/balance/stream?account_uuid=demo2";

        connectionManager.register(url1, cleanup1);
        connectionManager.register(url2, cleanup2);

        // The first connection should be closed
        expect(cleanup1).toHaveBeenCalledTimes(1);

        // Only one connection should remain
        expect(connectionManager.getConnectionCount()).toBe(1);
    });
});
