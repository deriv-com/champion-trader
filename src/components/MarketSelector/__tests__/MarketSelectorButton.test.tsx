import { render, screen } from "@testing-library/react";
import { MarketSelectorButton } from "../MarketSelectorButton";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";

// Mock the bottomSheetStore
jest.mock("@/stores/bottomSheetStore");

// Mock Lucide icons
jest.mock("lucide-react", () => ({
    ChevronDown: () => <div data-testid="chevron-down">ChevronDown</div>,
}));

// Mock MarketIcon component
jest.mock("../MarketIcon", () => ({
    MarketIcon: ({ symbol }: { symbol: string }) => <div data-testid="market-icon">{symbol}</div>,
}));

describe("MarketSelectorButton", () => {
    const mockSetBottomSheet = jest.fn();

    beforeEach(() => {
        (
            useBottomSheetStore as unknown as jest.MockedFunction<typeof useBottomSheetStore>
        ).mockReturnValue({
            setBottomSheet: mockSetBottomSheet,
            showBottomSheet: false,
            key: null,
            height: "87%",
            onDragDown: null,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders synthetic index correctly", () => {
        render(<MarketSelectorButton symbol="R_100" price="968.16" />);

        // Check main content
        expect(screen.getByText("Volatility 100 Index")).toBeInTheDocument();
        expect(screen.getByText("968.16")).toBeInTheDocument();

        // Check icon
        expect(screen.getByTestId("market-icon")).toBeInTheDocument();
        expect(screen.getByTestId("chevron-down")).toBeInTheDocument();

        // Check what should not be present
        expect(screen.queryByText("Closed")).not.toBeInTheDocument();

        // Check styling
        const button = screen.getByRole("button");
        expect(button).toHaveClass("bg-muted/50");
    });

    it("renders one-second synthetic index correctly", () => {
        render(<MarketSelectorButton symbol="1HZ100V" price="968.16" />);

        // Check main content
        expect(screen.getByText("Volatility 100 (1s) Index")).toBeInTheDocument();
        expect(screen.getByText("968.16")).toBeInTheDocument();

        // Check market icon
        expect(screen.getByTestId("market-icon")).toHaveTextContent("1HZ100V");
    });

    it("renders forex pair correctly", () => {
        render(<MarketSelectorButton symbol="EURUSD" price="1.0923" />);

        // Check main content
        expect(screen.getByText("EUR/USD")).toBeInTheDocument();
        expect(screen.getByText("1.0923")).toBeInTheDocument();

        // Check what should not be present
        expect(screen.queryByText("Closed")).not.toBeInTheDocument();

        // Check market icon
        expect(screen.getByTestId("market-icon")).toHaveTextContent("frxEURUSD");
    });

    it("renders closed market indicator for USDJPY", () => {
        render(<MarketSelectorButton symbol="USDJPY" price="145.23" />);

        // Check main content
        expect(screen.getByText("USD/JPY")).toBeInTheDocument();

        // Check closed indicator
        const closedBadge = screen.getByText("Closed");
        expect(closedBadge).toBeInTheDocument();
        expect(closedBadge).toHaveClass("bg-rose-500/10", "text-rose-500");
    });

    it("applies hover styles to button", () => {
        render(<MarketSelectorButton symbol="R_100" price="968.16" />);

        const button = screen.getByRole("button");
        expect(button).toHaveClass("hover:bg-muted/70");
    });
});
