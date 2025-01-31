import { renderHook } from "@testing-library/react";
import { useMarketWebSocket } from "../useMarketWebSocket";
import { useWebSocketStore } from "@/stores/websocketStore";
import { InstrumentPriceResponse, WebSocketError } from "@/services/api/websocket/types";

// Mock the websocket store
jest.mock("@/stores/websocketStore");

interface MockStore {
  initializeMarketService: jest.Mock;
  subscribeToInstrumentPrice: jest.Mock;
  unsubscribeFromInstrumentPrice: jest.Mock;
  instrumentPrices: Record<string, InstrumentPriceResponse>;
  isMarketConnected: boolean;
  marketError: WebSocketError | null;
}

describe("useMarketWebSocket", () => {
  const mockInitializeMarketService = jest.fn();
  const mockSubscribeToInstrumentPrice = jest.fn();
  const mockUnsubscribeFromInstrumentPrice = jest.fn();
  const mockOnPrice = jest.fn();
  const mockOnError = jest.fn();
  const mockOnConnect = jest.fn();
  const mockOnDisconnect = jest.fn();

  const mockPrice: InstrumentPriceResponse = {
    instrument_id: "R_100",
    bid: 1234.56,
    ask: 1234.78,
    timestamp: "2024-01-30T12:34:56Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useWebSocketStore as unknown as jest.Mock).mockReturnValue({
      initializeMarketService: mockInitializeMarketService,
      subscribeToInstrumentPrice: mockSubscribeToInstrumentPrice,
      unsubscribeFromInstrumentPrice: mockUnsubscribeFromInstrumentPrice,
      instrumentPrices: {},
      isMarketConnected: false,
      marketError: null,
    } as MockStore);
  });

  it("should initialize market service and subscribe to instrument price", () => {
    renderHook(() => useMarketWebSocket("R_100"));

    expect(mockInitializeMarketService).toHaveBeenCalled();
    expect(mockSubscribeToInstrumentPrice).toHaveBeenCalledWith("R_100");
  });

  it("should unsubscribe on unmount", () => {
    const { unmount } = renderHook(() => useMarketWebSocket("R_100"));

    unmount();

    expect(mockUnsubscribeFromInstrumentPrice).toHaveBeenCalledWith("R_100");
  });

  it("should call onPrice when price updates", () => {
    (useWebSocketStore as unknown as jest.Mock).mockReturnValue({
      initializeMarketService: mockInitializeMarketService,
      subscribeToInstrumentPrice: mockSubscribeToInstrumentPrice,
      unsubscribeFromInstrumentPrice: mockUnsubscribeFromInstrumentPrice,
      instrumentPrices: { R_100: mockPrice },
      isMarketConnected: false,
      marketError: null,
    } as MockStore);

    renderHook(() => useMarketWebSocket("R_100", { onPrice: mockOnPrice }));

    expect(mockOnPrice).toHaveBeenCalledWith(mockPrice);
  });

  it("should call onError when error occurs", () => {
    const mockError = { error: "Test error" };

    (useWebSocketStore as unknown as jest.Mock).mockReturnValue({
      initializeMarketService: mockInitializeMarketService,
      subscribeToInstrumentPrice: mockSubscribeToInstrumentPrice,
      unsubscribeFromInstrumentPrice: mockUnsubscribeFromInstrumentPrice,
      instrumentPrices: {},
      isMarketConnected: false,
      marketError: mockError,
    } as MockStore);

    renderHook(() => useMarketWebSocket("R_100", { onError: mockOnError }));

    expect(mockOnError).toHaveBeenCalledWith(mockError);
  });

  it("should call onConnect when connected", () => {
    (useWebSocketStore as unknown as jest.Mock).mockReturnValue({
      initializeMarketService: mockInitializeMarketService,
      subscribeToInstrumentPrice: mockSubscribeToInstrumentPrice,
      unsubscribeFromInstrumentPrice: mockUnsubscribeFromInstrumentPrice,
      instrumentPrices: {},
      isMarketConnected: true,
      marketError: null,
    } as MockStore);

    renderHook(() => useMarketWebSocket("R_100", { onConnect: mockOnConnect }));

    expect(mockOnConnect).toHaveBeenCalled();
  });

  it("should call onDisconnect when disconnected", () => {
    (useWebSocketStore as unknown as jest.Mock).mockReturnValue({
      initializeMarketService: mockInitializeMarketService,
      subscribeToInstrumentPrice: mockSubscribeToInstrumentPrice,
      unsubscribeFromInstrumentPrice: mockUnsubscribeFromInstrumentPrice,
      instrumentPrices: {},
      isMarketConnected: false,
      marketError: null,
    } as MockStore);

    renderHook(() =>
      useMarketWebSocket("R_100", { onDisconnect: mockOnDisconnect })
    );

    expect(mockOnDisconnect).toHaveBeenCalled();
  });

  it("should return current price, connection status and error", () => {
    (useWebSocketStore as unknown as jest.Mock).mockReturnValue({
      initializeMarketService: mockInitializeMarketService,
      subscribeToInstrumentPrice: mockSubscribeToInstrumentPrice,
      unsubscribeFromInstrumentPrice: mockUnsubscribeFromInstrumentPrice,
      instrumentPrices: { R_100: mockPrice },
      isMarketConnected: true,
      marketError: null,
    } as MockStore);

    const { result } = renderHook(() => useMarketWebSocket("R_100"));

    expect(result.current).toEqual({
      price: mockPrice,
      isConnected: true,
      error: null,
    });
  });

  it("should resubscribe when instrument ID changes", () => {
    const { rerender } = renderHook(
      (instrumentId) => useMarketWebSocket(instrumentId),
      { initialProps: "R_100" }
    );

    expect(mockSubscribeToInstrumentPrice).toHaveBeenCalledWith("R_100");
    expect(mockUnsubscribeFromInstrumentPrice).not.toHaveBeenCalled();

    rerender("R_200");

    expect(mockUnsubscribeFromInstrumentPrice).toHaveBeenCalledWith("R_100");
    expect(mockSubscribeToInstrumentPrice).toHaveBeenCalledWith("R_200");
  });
});
