import { render, act, screen } from "@testing-library/react";
import { App } from "./App";
import { useContractSSE } from "@/hooks/sse";
import { MainLayout } from "@/layouts/MainLayout";
import { useClientStore } from "@/stores/clientStore";

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

// Mock CSS imports
jest.mock('@deriv/deriv-charts/dist/smartcharts.css', () => ({}), { virtual: true });

// Mock the websocket, SSE hooks, and client store

jest.mock("@/hooks/sse", () => ({
  useContractSSE: jest.fn(),
}));

// Mock the client store with proper typing
jest.mock("@/stores/clientStore", () => ({
  useClientStore: jest.fn().mockReturnValue({
    token: null,
    isLoggedIn: false,
    setToken: jest.fn(),
    logout: jest.fn(),
  }),
}));

describe("App", () => {
  const mockMainLayout = MainLayout as jest.Mock;
  const mockUseContractSSE = useContractSSE as jest.Mock;
  const mockUseClientStore = useClientStore as unknown as jest.Mock;

  beforeEach(() => {
    mockMainLayout.mockClear();
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Default mock implementations
    mockUseClientStore.mockReturnValue({
      token: "test-token",
      isLoggedIn: true,
      setToken: jest.fn(),
      logout: jest.fn(),
    });


    mockUseContractSSE.mockReturnValue({
      price: null,
      error: null,
      isConnected: true,
    });

    // Mock console methods
    jest.spyOn(console, "log").mockImplementation();
  });

  it("renders trade page by default and handles lazy loading", async () => {
    render(<App />);

    // Verify loading state
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Verify trade page is rendered after lazy loading
    expect(await screen.findByTestId("trade-page")).toBeInTheDocument();
  });





  it("handles contract SSE price updates when logged in", () => {
    mockUseClientStore.mockReturnValue({
      token: "test-token",
      isLoggedIn: true,
      setToken: jest.fn(),
      logout: jest.fn(),
    });
    render(<App />);

    const mockPrice = {
      date_start: Date.now(),
      date_expiry: Date.now() + 60000,
      spot: "1234.56",
      strike: "1234.56",
      price: "5.67",
      trade_type: "CALL",
      instrument: "R_100",
      currency: "USD",
      payout: "100",
      pricing_parameters: {
        volatility: "0.5",
        duration_in_years: "0.00190259"
      }
    };

    // Get the price handler from the mock calls
    const { onPrice } = mockUseContractSSE.mock.calls[0][2];

    // Simulate price update
    act(() => {
      onPrice(mockPrice);
    });

    expect(console.log).toHaveBeenCalledWith("Contract Price Update:", mockPrice);
  });

  it("handles contract SSE errors when logged in", () => {
    mockUseClientStore.mockReturnValue({
      token: "test-token",
      isLoggedIn: true,
      setToken: jest.fn(),
      logout: jest.fn(),
    });
    render(<App />);

    const mockError = new Error("Contract SSE error");

    // Get the error handler from the mock calls
    const { onError } = mockUseContractSSE.mock.calls[0][2];

    // Simulate error
    act(() => {
      onError(mockError);
    });

    expect(console.log).toHaveBeenCalledWith("Contract SSE Error:", mockError);
  });

  it("does not initialize contract SSE when not logged in", () => {
    mockUseClientStore.mockReturnValue({
      token: null,
      isLoggedIn: false,
      setToken: jest.fn(),
      logout: jest.fn(),
    });
    render(<App />);

    expect(mockUseContractSSE).not.toHaveBeenCalled();
  });
});
