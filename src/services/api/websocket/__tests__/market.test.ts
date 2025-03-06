// Mock the API config
jest.mock("@/config/api", () => ({
    apiConfig: {
        ws: {
            baseUrl: "wss://test.example.com",
            publicPath: "/ws",
            protectedPath: "/ws",
        },
    },
}));

// Import services after mocking
import { MarketWebSocketService } from "../market/service";
import { InstrumentPriceResponse } from "@/services/api/websocket/types";

describe("MarketWebSocketService", () => {
    let service: MarketWebSocketService;
    let mockWs: jest.Mocked<WebSocket>;
    let wsReadyState: number;
    let eventHandlers: Record<string, ((event: any) => void) | undefined>;

    beforeEach(() => {
        // Mock WebSocket static properties
        (global as any).WebSocket = class MockWebSocket {
            static CONNECTING = 0;
            static OPEN = 1;
            static CLOSING = 2;
            static CLOSED = 3;
        };

        wsReadyState = WebSocket.CONNECTING;
        eventHandlers = {
            open: undefined,
            close: undefined,
            error: undefined,
            message: undefined,
        };

        mockWs = {
            get readyState() {
                return wsReadyState;
            },
            send: jest.fn(),
            close: jest.fn(),
            addEventListener: jest
                .fn()
                .mockImplementation((event: string, handler: (event: any) => void) => {
                    eventHandlers[event] = handler;
                }),
            removeEventListener: jest.fn(),
        } as any;

        // Mock WebSocket constructor
        (global as any).WebSocket = jest.fn().mockImplementation(() => mockWs);

        service = new MarketWebSocketService();
    });

    afterEach(() => {
        service.disconnect();
        jest.clearAllMocks();
    });

    const connectWebSocket = () => {
        service.connect();
        wsReadyState = WebSocket.OPEN;
        if (eventHandlers.open) {
            eventHandlers.open({});
        }
    };

    it("should connect and setup event handlers", () => {
        connectWebSocket();

        expect(global.WebSocket).toHaveBeenCalledWith("wss://test.example.com/ws");
        expect(mockWs.addEventListener).toHaveBeenCalledWith("open", expect.any(Function));
        expect(mockWs.addEventListener).toHaveBeenCalledWith("close", expect.any(Function));
        expect(mockWs.addEventListener).toHaveBeenCalledWith("error", expect.any(Function));
        expect(mockWs.addEventListener).toHaveBeenCalledWith("message", expect.any(Function));
    });

    it("should subscribe to instrument price", () => {
        connectWebSocket();
        service.subscribeToPrice("R_100");

        expect(mockWs.send).toHaveBeenCalledWith(
            JSON.stringify({
                action: "instrument_price",
                data: { instrument_id: "R_100" },
            })
        );
    });

    it("should handle instrument price updates", () => {
        connectWebSocket();
        const mockHandler = jest.fn();
        const mockData: InstrumentPriceResponse = {
            instrument_id: "R_100",
            bid: 1234.56,
            ask: 1234.78,
            timestamp: "2024-01-30T12:34:56Z",
        };

        service.on("instrument_price", mockHandler);

        // Simulate receiving a message
        if (eventHandlers.message) {
            eventHandlers.message({
                data: JSON.stringify({
                    action: "instrument_price",
                    data: mockData,
                }),
            });
        }

        expect(mockHandler).toHaveBeenCalledWith({
            action: "instrument_price",
            data: mockData,
        });
    });

    it("should handle connection errors", () => {
        connectWebSocket();
        const mockErrorHandler = jest.fn();
        service.onError(mockErrorHandler);

        // Simulate an error
        if (eventHandlers.error) {
            eventHandlers.error(new Event("error"));
        }

        expect(mockErrorHandler).toHaveBeenCalledWith({
            error: "WebSocket connection error",
        });
    });

    it("should not send messages when disconnected", () => {
        connectWebSocket();
        const mockErrorHandler = jest.fn();
        service.onError(mockErrorHandler);

        // First set the state to CLOSED, then disconnect
        wsReadyState = WebSocket.CLOSED;
        service.disconnect();

        // Try to subscribe after disconnect
        service.subscribeToPrice("R_100");

        expect(mockErrorHandler).toHaveBeenCalledWith({
            error: "WebSocket is not connected",
        });
        expect(mockWs.send).not.toHaveBeenCalled();
    });

    it("should track subscriptions", () => {
        connectWebSocket();
        service.subscribeToPrice("R_100");
        expect(service["subscriptions"].size).toBe(1);
        expect(service["subscriptions"].has("R_100")).toBe(true);

        service.unsubscribeFromPrice("R_100");
        expect(service["subscriptions"].size).toBe(0);
    });

    it("should resubscribe after reconnect", () => {
        connectWebSocket();
        service.subscribeToPrice("R_100");
        service.subscribeToPrice("R_200");

        // Clear previous send calls
        (mockWs.send as jest.Mock).mockClear();

        // Simulate disconnect and reconnect
        service.disconnect();
        wsReadyState = WebSocket.CONNECTING;
        service.connect();
        wsReadyState = WebSocket.OPEN;
        if (eventHandlers.open) {
            eventHandlers.open({});
        }

        // Should resubscribe to both instruments
        expect(mockWs.send).toHaveBeenCalledTimes(2);
        expect(mockWs.send).toHaveBeenCalledWith(
            JSON.stringify({
                action: "instrument_price",
                data: { instrument_id: "R_100" },
            })
        );
        expect(mockWs.send).toHaveBeenCalledWith(
            JSON.stringify({
                action: "instrument_price",
                data: { instrument_id: "R_200" },
            })
        );
    });

    it("should handle invalid messages", () => {
        connectWebSocket();
        const mockErrorHandler = jest.fn();
        service.onError(mockErrorHandler);

        // Simulate receiving an invalid message
        if (eventHandlers.message) {
            eventHandlers.message({ data: "invalid json" });
        }

        expect(mockErrorHandler).toHaveBeenCalledWith({
            error: "Failed to parse WebSocket message",
        });
    });

    it("should handle server errors", () => {
        connectWebSocket();
        const mockErrorHandler = jest.fn();
        service.onError(mockErrorHandler);

        // Simulate receiving a server error
        if (eventHandlers.message) {
            eventHandlers.message({
                data: JSON.stringify({
                    error: { error: "Server error" },
                }),
            });
        }

        expect(mockErrorHandler).toHaveBeenCalledWith({ error: "Server error" });
    });
});
