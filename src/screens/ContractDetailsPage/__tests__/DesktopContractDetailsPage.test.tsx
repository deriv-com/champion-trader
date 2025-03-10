import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate, useParams } from "react-router-dom";
import DesktopContractDetailsPage from "../DesktopContractDetailsPage";
import { useContractDetailsStream } from "@/hooks/useContractDetailsStream";
import { useContractDetailsRest } from "@/hooks/useContractDetailsRest";
import * as tradeStore from "@/stores/tradeStore";
import * as mainLayoutStore from "@/stores/mainLayoutStore";
import { ProcessedContract } from "@/hooks/useProcessedContracts";
import { TradeState } from "@/stores/tradeStore";

// Mock the router hooks
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

// Mock the contract details hooks
jest.mock("@/hooks/useContractDetailsStream", () => ({
  useContractDetailsStream: jest.fn(),
}));

jest.mock("@/hooks/useContractDetailsRest", () => ({
  useContractDetailsRest: jest.fn(),
}));

// Mock the components
jest.mock("@/components/ContractDetailsChart/ContractDetailsChart", () => ({
  ContractDetailsChart: () => <div data-testid="contract-details-chart">Chart placeholder</div>,
}));

jest.mock("@/components/ContractCard", () => ({
  ContractCard: ({ contract, variant }: { contract: ProcessedContract, variant: string }) => (
    <div data-testid="contract-card">
      Contract Card: {contract.type} - {contract.market} - {variant}
    </div>
  ),
}));

jest.mock("../components", () => ({
  OrderDetails: function OrderDetails() { return <div data-testid="order-details">Order Details</div> },
  EntryExitDetails: function EntryExitDetails() { return <div data-testid="entry-exit-details">Entry Exit Details</div> },
}), { virtual: true });

// Mock the stores
const setSideNavVisibleMock = jest.fn();
jest.spyOn(mainLayoutStore, "useMainLayoutStore").mockImplementation(() => ({
  setSideNavVisible: setSideNavVisibleMock,
  sideNavVisible: true,
}));

describe("DesktopContractDetailsPage", () => {
  const mockNavigate = jest.fn();
  const mockContractDetails: ProcessedContract = {
    id: 123,
    originalId: "123",
    type: "Rise",
    market: "Volatility 100 (1s) Index",
    duration: "5 minutes",
    stake: "10.00",
    profit: "+0.00",
    isOpen: true,
    barrier: "100.00",
    payout: "20.00",
    referenceId: "547294814948",
    startTime: "06 Mar 2025",
    startTimeGMT: "13:47:53 GMT",
    entrySpot: "103.834",
    entryTimeGMT: "13:47:53 GMT",
    exitTime: "06 Mar 2025",
    exitTimeGMT: "13:52:53 GMT",
    exitSpot: "104.000"
  };

  // Create a mock TradeState that includes all required properties
  const mockTradeState: TradeState = {
    stake: "10",
    duration: "5 minute",
    allowEquals: false,
    trade_type: "rise_fall",
    instrument: "R_100",
    payouts: {
      max: 50000,
      values: {
        buy_rise: 19.5,
        buy_fall: 19.5,
      },
    },
    setStake: jest.fn(),
    setDuration: jest.fn(),
    toggleAllowEquals: jest.fn(),
    setPayouts: jest.fn(),
    setInstrument: jest.fn(),
    setTradeType: jest.fn(),
    contractDetails: mockContractDetails,
    setContractDetails: jest.fn(),
  };

  // Create a mock TradeState with null contractDetails
  const mockTradeStateNoContract: TradeState = {
    ...mockTradeState,
    contractDetails: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useParams as jest.Mock).mockReturnValue({ id: "123" });
    (useContractDetailsStream as jest.Mock).mockReturnValue({ loading: false, error: null });
    (useContractDetailsRest as jest.Mock).mockReturnValue({ loading: false, error: null });
    
    // Mock the trade store with contract details
    jest.spyOn(tradeStore, "useTradeStore").mockImplementation((selector) => {
      if (typeof selector === "function") {
        return selector(mockTradeState);
      }
      return mockTradeState;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders all components correctly when contract details are available", () => {
    render(<DesktopContractDetailsPage />);

    // Check header
    expect(screen.getByText("Contract details")).toBeInTheDocument();

    // Check all sections are rendered
    expect(screen.getByTestId("contract-card")).toBeInTheDocument();
    expect(screen.getByTestId("order-details")).toBeInTheDocument();
    expect(screen.getByTestId("entry-exit-details")).toBeInTheDocument();

    // Check chart placeholder
    expect(screen.getByTestId("contract-details-chart")).toBeInTheDocument();

    // Check close button
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  it("navigates back when close button is clicked", () => {
    render(<DesktopContractDetailsPage />);
    
    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("navigates back when header close button is clicked", () => {
    render(<DesktopContractDetailsPage />);
    
    const headerCloseButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(headerCloseButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("has correct layout structure", () => {
    render(<DesktopContractDetailsPage />);

    // Check main container
    const mainContainer = screen.getByTestId("desktop-contract-details");
    expect(mainContainer).toHaveClass("flex flex-col bg-gray-50 w-full");

    // Check left panel
    const leftPanel = screen.getByTestId("left-panel");
    expect(leftPanel).toHaveClass("w-[320px] bg-white flex flex-col");

    // Check content area
    const contentArea = screen.getByTestId("content-area");
    expect(contentArea).toHaveClass("flex-1 overflow-y-auto pb-20 space-y-4 bg-gray-50");

    // Check close button container
    const closeButtonContainer = screen.getByTestId("close-button-container");
    expect(closeButtonContainer).toHaveClass("absolute bottom-0 left-0 right-0 m-4 w-[290px] b-[55px]");
  });

  it("shows loading state when contracts are loading", () => {
    // Mock loading state
    (useContractDetailsStream as jest.Mock).mockReturnValue({ loading: true, error: null });
    
    // Mock the trade store with no contract details
    jest.spyOn(tradeStore, "useTradeStore").mockImplementation((selector) => {
      if (typeof selector === "function") {
        return selector(mockTradeStateNoContract);
      }
      return mockTradeStateNoContract;
    });
    
    render(<DesktopContractDetailsPage />);
    
    expect(screen.getByTestId("desktop-contract-details-loading")).toBeInTheDocument();
    expect(screen.getByText("Loading contract details...")).toBeInTheDocument();
  });

  it("shows error state when there is an error", () => {
    // Mock error state
    (useContractDetailsStream as jest.Mock).mockReturnValue({ loading: false, error: "Failed to stream contract details" });
    
    // Mock the trade store with no contract details
    jest.spyOn(tradeStore, "useTradeStore").mockImplementation((selector) => {
      if (typeof selector === "function") {
        return selector(mockTradeStateNoContract);
      }
      return mockTradeStateNoContract;
    });
    
    render(<DesktopContractDetailsPage />);
    
    expect(screen.getByTestId("desktop-contract-details-error")).toBeInTheDocument();
    expect(screen.getByText("Failed to stream contract details")).toBeInTheDocument();
    
    // Check go back button
    const goBackButton = screen.getByText("Go Back");
    fireEvent.click(goBackButton);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("hides side nav when mounted and shows it when unmounted", () => {
    const { unmount } = render(<DesktopContractDetailsPage />);
    
    // Should hide side nav on mount
    expect(setSideNavVisibleMock).toHaveBeenCalledWith(false);
    
    // Should show side nav on unmount
    unmount();
    expect(setSideNavVisibleMock).toHaveBeenCalledWith(true);
  });

  it("renders contract card with mobile variant", () => {
    render(<DesktopContractDetailsPage />);
    
    expect(screen.getByTestId("contract-card")).toHaveTextContent("Contract Card: Rise - Volatility 100 (1s) Index - mobile");
  });
});
