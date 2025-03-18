import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DesktopContractDetailsPage from "../DesktopContractDetailsPage";

// Mock the router hook
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

// Mock the stores
const mockSetSideNavVisible = jest.fn();
jest.mock("@/stores/mainLayoutStore", () => ({
    useMainLayoutStore: () => ({
        setSideNavVisible: mockSetSideNavVisible,
    }),
}));

// Mock contract details
const mockContractDetails = {
    contract_id: "123",
    bid_price: "1.90",
    bid_price_currency: "USD",
    is_valid_to_sell: true,
};

// Mock the tradeStore with a simple function that returns the mock data
jest.mock("@/stores/tradeStore", () => ({
    useTradeStore: () => ({
        contractDetails: mockContractDetails,
    }),
}));

// Mock the trade actions
const mockSellContract = jest.fn();
jest.mock("@/hooks/useTradeActions", () => ({
    useTradeActions: () => ({
        sell_contract: mockSellContract,
    }),
}));

// Mock the components
jest.mock("@/components/ContractDetailsChart/ContractDetailsChart", () => ({
    ContractDetailsChart: () => <div data-testid="chart-placeholder">Chart placeholder</div>,
}));

jest.mock("../components", () => ({
    ContractSummary: () => <div data-testid="contract-summary">Contract Summary</div>,
    OrderDetails: () => <div data-testid="order-details">Order Details</div>,
    EntryExitDetails: () => <div data-testid="entry-exit-details">Entry Exit Details</div>,
}));

// Mock the X icon
jest.mock("lucide-react", () => ({
    X: () => <div data-testid="x-icon">X</div>,
}));

describe("DesktopContractDetailsPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Setup mock implementation for sell_contract
        mockSellContract.mockImplementation((contractId, _contractDetails, options) => {
            if (options?.setLoading) {
                options.setLoading(true);
            }
            if (options?.onSuccess) {
                options.onSuccess();
            }
            return Promise.resolve({ data: { contract_id: contractId } });
        });
    });

    it("renders all components correctly", () => {
        render(<DesktopContractDetailsPage />);

        // Check header
        expect(screen.getByText("Contract details")).toBeInTheDocument();

        // Check all sections are rendered
        expect(screen.getByTestId("contract-summary")).toBeInTheDocument();
        expect(screen.getByTestId("order-details")).toBeInTheDocument();
        expect(screen.getByTestId("entry-exit-details")).toBeInTheDocument();

        // Check chart placeholder
        expect(screen.getByTestId("chart-placeholder")).toBeInTheDocument();

        // Check close button (using a more flexible approach)
        const closeButton = screen.getByRole("button", { name: /Close/i });
        expect(closeButton).toBeInTheDocument();
    });

    it("sets side nav visibility on mount and unmount", () => {
        const { unmount } = render(<DesktopContractDetailsPage />);

        // Check that setSideNavVisible was called with false on mount
        expect(mockSetSideNavVisible).toHaveBeenCalledWith(false);

        // Unmount the component
        unmount();

        // Check that setSideNavVisible was called with true on unmount
        expect(mockSetSideNavVisible).toHaveBeenCalledWith(true);
    });

    it("navigates back when header close button is clicked", () => {
        render(<DesktopContractDetailsPage />);

        // Find the header close button (it's the button containing the X icon)
        const headerCloseButton = screen.getByTestId("x-icon").closest("button");
        if (!headerCloseButton) {
            throw new Error("Header close button not found");
        }
        fireEvent.click(headerCloseButton);

        // Check that navigate was called with -1
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it("shows 'Closing...' text when isClosing is true", () => {
        // Mock React's useState to return isClosing as true
        jest.spyOn(React, "useState").mockImplementationOnce(() => [true, jest.fn()]);

        render(<DesktopContractDetailsPage />);

        // Check that the button text is "Closing..."
        expect(screen.getByText("Closing...")).toBeInTheDocument();
    });

    it("disables close contract button when contractDetails.contract_id is falsy", () => {
        // Mock useTradeStore to return contractDetails without contract_id
        jest.spyOn(require("@/stores/tradeStore"), "useTradeStore").mockReturnValueOnce({
            contractDetails: {
                bid_price: "1.90",
                bid_price_currency: "USD",
            },
        });

        render(<DesktopContractDetailsPage />);

        // Find the close contract button and check it's disabled
        const closeButton = screen.getByRole("button", { name: /Close/i });
        expect(closeButton).toBeDisabled();
    });

    it("renders components in correct order", () => {
        render(<DesktopContractDetailsPage />);

        const content = screen.getByTestId("content-area");
        const children = Array.from(content.children);

        // Check components are rendered in correct order
        expect(children[0]).toHaveAttribute("data-testid", "contract-summary");
        expect(children[1]).toHaveAttribute("data-testid", "order-details");
        expect(children[2]).toHaveAttribute("data-testid", "entry-exit-details");
    });

    it("has correct layout structure", () => {
        render(<DesktopContractDetailsPage />);

        // Check main container
        const mainContainer = screen.getByTestId("desktop-contract-details");
        expect(mainContainer).toHaveClass("flex flex-col bg-theme-secondary w-full");

        // Check left panel
        const leftPanel = screen.getByTestId("left-panel");
        expect(leftPanel).toHaveClass("w-[320px] flex flex-col");

        // Check content area
        const contentArea = screen.getByTestId("content-area");
        expect(contentArea).toHaveClass(
            "flex-1 overflow-y-auto pb-20 space-y-4 bg-theme-secondary"
        );

        // Check close button container
        const closeButtonContainer = screen.getByTestId("close-button-container");
        expect(closeButtonContainer).toHaveClass(
            "absolute bottom-0 left-0 right-0 m-4 w-[290px] b-[55px]"
        );
    });
});
