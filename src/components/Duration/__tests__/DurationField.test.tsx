import { render, screen, fireEvent, act } from "@testing-library/react";
import { DurationField } from "../DurationField";
import { useTradeStore } from "@/stores/tradeStore";
import { useOrientationStore } from "@/stores/orientationStore";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";

// Mock components
jest.mock("@/components/TradeFields/TradeParam", () => ({
    __esModule: true,
    default: ({ label, value, onClick, className }: any) => (
        <button
            data-testid="trade-param"
            data-label={label}
            data-value={value}
            onClick={onClick}
            className={className}
        >
            <span>{value}</span>
        </button>
    ),
}));

jest.mock("@/components/ui/desktop-trade-field-card", () => ({
    DesktopTradeFieldCard: ({ children, isSelected }: any) => (
        <div data-testid="desktop-trade-field-card" data-selected={isSelected}>
            {children}
        </div>
    ),
}));

jest.mock("@/components/ui/mobile-trade-field-card", () => ({
    MobileTradeFieldCard: ({ children, onClick }: any) => (
        <div data-testid="mobile-trade-field-card" onClick={onClick}>
            {children}
        </div>
    ),
}));

jest.mock("@/components/ui/popover", () => ({
    Popover: ({ children }: any) => <div data-testid="popover">{children}</div>,
}));

jest.mock("../DurationController", () => ({
    DurationController: ({ onClose }: { onClose: () => void }) => (
        <div data-testid="duration-controller">
            <button data-testid="duration-controller-close" onClick={onClose}>
                Close Controller
            </button>
        </div>
    ),
}));

// Mock stores
jest.mock("@/stores/tradeStore", () => ({
    useTradeStore: jest.fn(),
}));

jest.mock("@/stores/orientationStore", () => ({
    useOrientationStore: jest.fn(),
}));

jest.mock("@/stores/bottomSheetStore", () => ({
    useBottomSheetStore: jest.fn(),
}));

describe("DurationField", () => {
    const mockSetBottomSheet = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();

        // Default store mocks
        (useTradeStore as jest.MockedFunction<typeof useTradeStore>).mockReturnValue({
            duration: "1 minutes",
            isConfigLoading: false,
            productConfig: {
                data: {
                    validations: {
                        durations: {
                            supported_units: ["ticks", "seconds", "minutes", "hours", "days"],
                        },
                    },
                },
            },
        });

        (useOrientationStore as jest.MockedFunction<typeof useOrientationStore>).mockReturnValue({
            isLandscape: false,
        });

        (useBottomSheetStore as jest.MockedFunction<typeof useBottomSheetStore>).mockReturnValue({
            setBottomSheet: mockSetBottomSheet,
        });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe("Loading State", () => {
        it("should show skeleton loader when config is loading", () => {
            (useTradeStore as jest.MockedFunction<typeof useTradeStore>).mockReturnValue({
                duration: "1 minutes",
                isConfigLoading: true,
                productConfig: null,
            });

            render(<DurationField />);

            const skeleton = screen.getByTestId("duration-field-skeleton");
            expect(skeleton).toBeInTheDocument();
            expect(screen.queryByTestId("trade-param")).not.toBeInTheDocument();
        });

        it("should show duration value when not loading", () => {
            render(<DurationField />);

            const param = screen.getByTestId("trade-param");
            expect(param).toBeInTheDocument();
            expect(param).toHaveAttribute("data-label", "Duration");
            expect(param).toHaveAttribute("data-value", "1 minutes");
            expect(screen.queryByTestId("duration-field-skeleton")).not.toBeInTheDocument();
        });
    });

    describe("Error State", () => {
        it("should display N/A when productConfig is null", () => {
            (useTradeStore as jest.MockedFunction<typeof useTradeStore>).mockReturnValue({
                duration: "1 minutes",
                isConfigLoading: false,
                productConfig: null,
            });

            render(<DurationField />);

            const param = screen.getByTestId("trade-param");
            expect(param).toHaveAttribute("data-value", "N/A");
            expect(param.className).toContain("opacity-50");
            expect(param.className).toContain("cursor-not-allowed");
        });

        it("should not trigger click actions when productConfig is null", () => {
            (useTradeStore as jest.MockedFunction<typeof useTradeStore>).mockReturnValue({
                duration: "1 minutes",
                isConfigLoading: false,
                productConfig: null,
            });

            render(<DurationField />);

            fireEvent.click(screen.getByTestId("trade-param"));
            expect(mockSetBottomSheet).not.toHaveBeenCalled();
        });
    });

    describe("Portrait Mode", () => {
        beforeEach(() => {
            (
                useOrientationStore as jest.MockedFunction<typeof useOrientationStore>
            ).mockReturnValue({
                isLandscape: false,
            });
        });

        it("should open bottom sheet when clicked", () => {
            render(<DurationField />);

            fireEvent.click(screen.getByTestId("trade-param"));

            expect(mockSetBottomSheet).toHaveBeenCalledWith(true, "duration", "470px");
        });

        it("should not render popover", () => {
            render(<DurationField />);

            fireEvent.click(screen.getByTestId("trade-param"));

            expect(screen.queryByTestId("popover")).not.toBeInTheDocument();
        });

        it("should wrap in mobile trade field card", () => {
            render(<DurationField />);

            expect(screen.getByTestId("mobile-trade-field-card")).toBeInTheDocument();
            expect(screen.queryByTestId("desktop-trade-field-card")).not.toBeInTheDocument();
        });
    });

    describe("Landscape Mode", () => {
        beforeEach(() => {
            (
                useOrientationStore as jest.MockedFunction<typeof useOrientationStore>
            ).mockReturnValue({
                isLandscape: true,
            });
        });

        it("should wrap in desktop trade field card", () => {
            render(<DurationField />);

            const card = screen.getByTestId("desktop-trade-field-card");
            expect(card).toBeInTheDocument();
            expect(card).toHaveAttribute("data-selected", "false");
        });

        it("should show duration controller in popover when clicked", () => {
            render(<DurationField />);

            fireEvent.click(screen.getByTestId("trade-param"));

            expect(screen.getByTestId("popover")).toBeInTheDocument();
            expect(screen.getByTestId("duration-controller")).toBeInTheDocument();
            expect(screen.getByTestId("desktop-trade-field-card")).toHaveAttribute(
                "data-selected",
                "true"
            );
        });

        it("should close popover when close button clicked", () => {
            render(<DurationField />);

            // Open popover
            fireEvent.click(screen.getByTestId("trade-param"));
            expect(screen.getByTestId("duration-controller")).toBeInTheDocument();
            expect(screen.getByTestId("desktop-trade-field-card")).toHaveAttribute(
                "data-selected",
                "true"
            );

            // Close popover
            fireEvent.click(screen.getByTestId("duration-controller-close"));
            expect(screen.queryByTestId("popover")).not.toBeInTheDocument();
            expect(screen.getByTestId("desktop-trade-field-card")).toHaveAttribute(
                "data-selected",
                "false"
            );
        });

        it("should prevent reopening during closing animation", () => {
            render(<DurationField />);

            // Open popover
            fireEvent.click(screen.getByTestId("trade-param"));
            expect(screen.getByTestId("duration-controller")).toBeInTheDocument();

            // Close popover
            fireEvent.click(screen.getByTestId("duration-controller-close"));

            // Try to reopen immediately
            fireEvent.click(screen.getByTestId("trade-param"));
            expect(screen.queryByTestId("popover")).not.toBeInTheDocument();

            // After animation delay
            act(() => {
                jest.advanceTimersByTime(300);
            });

            // Should be able to open again
            fireEvent.click(screen.getByTestId("trade-param"));
            expect(screen.getByTestId("popover")).toBeInTheDocument();
            expect(screen.getByTestId("duration-controller")).toBeInTheDocument();
        });

        it("should not show popover when productConfig is null", () => {
            (useTradeStore as jest.MockedFunction<typeof useTradeStore>).mockReturnValue({
                duration: "1 minutes",
                isConfigLoading: false,
                productConfig: null,
            });

            render(<DurationField />);

            fireEvent.click(screen.getByTestId("trade-param"));
            expect(screen.queryByTestId("popover")).not.toBeInTheDocument();
        });
    });
});
