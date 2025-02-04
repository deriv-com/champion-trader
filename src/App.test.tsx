import { render, act, screen } from "@testing-library/react";
import { App } from "./App";
import { useMarketWebSocket } from "@/hooks/websocket";
import { MainLayout } from "@/layouts/MainLayout";

// Mock EventSource for SSE tests
class MockEventSource {
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onopen: (() => void) | null = null;
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  close() {}
}

global.EventSource = MockEventSource as any;

// Mock the lazy-loaded components
jest.mock("@/screens/TradePage", () => ({
  TradePage: () => <div data-testid="trade-page">Trade Page</div>,
}));

jest.mock("@/screens/PositionsPage", () => ({
  PositionsPage: () => <div data-testid="positions-page">Positions Page</div>,
}));

jest.mock("@/screens/MenuPage", () => ({
  MenuPage: () => <div data-testid="menu-page">Menu Page</div>,
}));

// Mock the MainLayout
jest.mock("@/layouts/MainLayout", () => ({
  MainLayout: jest.fn(({ children }) => (
    <div data-testid="main-layout">{children}</div>
  )),
}));

// Mock the websocket hook
jest.mock("@/hooks/websocket", () => ({
  useMarketWebSocket: jest.fn(),
}));

describe("App", () => {
  const mockMainLayout = MainLayout as jest.Mock;
  const mockUseMarketWebSocket = useMarketWebSocket as jest.Mock;

  beforeEach(() => {
    mockMainLayout.mockClear();
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Default mock implementation
    mockUseMarketWebSocket.mockReturnValue({
      isConnected: true,
      error: null,
      price: null,
    });

    // Mock console methods
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });

  it("renders trade page by default and handles lazy loading", async () => {
    render(<App />);

    // Verify loading state
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Verify trade page is rendered after lazy loading
    expect(await screen.findByTestId("trade-page")).toBeInTheDocument();
  });

  it("initializes market websocket with correct instrument", () => {
    render(<App />);

    // Verify MainLayout is rendered
    expect(screen.getByTestId("main-layout")).toBeInTheDocument();

    expect(mockUseMarketWebSocket).toHaveBeenCalledWith(
      "R_100",
      expect.objectContaining({
        onConnect: expect.any(Function),
        onError: expect.any(Function),
        onPrice: expect.any(Function),
      })
    );
  });

  it("logs connection status changes", () => {
    mockUseMarketWebSocket.mockReturnValue({
      isConnected: false,
      error: null,
      price: null,
    });

    render(<App />);

    expect(console.log).toHaveBeenCalledWith("Market WebSocket Disconnected");
  });

  it("handles websocket errors", () => {
    const mockError = new Error("WebSocket error");

    render(<App />);

    // Get the error handler from the mock calls
    const { onError } = mockUseMarketWebSocket.mock.calls[0][1];

    // Simulate error
    act(() => {
      onError(mockError);
    });

    expect(console.error).toHaveBeenCalledWith(
      "Market WebSocket Error:",
      mockError
    );
  });

  it("handles price updates", () => {
    render(<App />);

    const mockPrice = {
      instrument_id: "R_100",
      bid: 100,
      ask: 101,
      timestamp: "2024-01-30T00:00:00Z",
    };

    // Get the price handler from the mock calls
    const { onPrice } = mockUseMarketWebSocket.mock.calls[0][1];

    // Simulate price update
    act(() => {
      onPrice(mockPrice);
    });

    expect(console.log).toHaveBeenCalledWith("Price Update:", mockPrice);
  });
});
