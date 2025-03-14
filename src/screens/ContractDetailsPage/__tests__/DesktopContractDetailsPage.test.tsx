import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import DesktopContractDetailsPage from "../DesktopContractDetailsPage";

// Mock the router hook
jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
}));

// Mock the components
jest.mock("@/components/ContractDetailsChart/ContractDetailsChart", () => ({
    ContractDetailsChart: () => <div>Chart placeholder</div>,
}));

jest.mock(
    "../components",
    () => ({
        ContractSummary: function ContractSummary() {
            return React.createElement(
                "div",
                { "data-testid": "contract-summary" },
                "Contract Summary"
            );
        },
        OrderDetails: function OrderDetails() {
            return React.createElement("div", { "data-testid": "order-details" }, "Order Details");
        },
        Payout: function Payout() {
            return React.createElement("div", { "data-testid": "payout" }, "Payout");
        },
        EntryExitDetails: function EntryExitDetails() {
            return React.createElement(
                "div",
                { "data-testid": "entry-exit-details" },
                "Entry Exit Details"
            );
        },
    }),
    { virtual: true }
);

describe("DesktopContractDetailsPage", () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    });

    afterEach(() => {
        jest.clearAllMocks();
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
        expect(screen.getByText("Chart placeholder")).toBeInTheDocument();

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

    it("renders in correct order", () => {
        render(<DesktopContractDetailsPage />);

        const content = screen.getByTestId("content-area");
        const children = Array.from(content.children);

        // Check components are rendered in correct order
        expect(children[0]).toHaveAttribute("data-testid", "contract-summary");
        expect(children[1]).toHaveAttribute("data-testid", "order-details");
        expect(children[2]).toHaveAttribute("data-testid", "entry-exit-details");
    });
});
