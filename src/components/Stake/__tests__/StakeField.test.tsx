import { render, screen, fireEvent } from "@testing-library/react";
import { StakeField } from "../StakeField";
import { useTradeStore } from "@/stores/tradeStore";
import { useOrientationStore } from "@/stores/orientationStore";
import { useClientStore } from "@/stores/clientStore";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { useTooltipStore } from "@/stores/tooltipStore";

// Mock components
jest.mock("@/components/ui/tooltip", () => ({
    Tooltip: () => <div data-testid="tooltip" />,
}));

jest.mock("@/components/ui/desktop-trade-field-card", () => ({
    DesktopTradeFieldCard: ({ children, isSelected, error }: any) => (
        <div data-testid="desktop-trade-field-card" data-selected={isSelected} data-error={error}>
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

// Mock stores
jest.mock("@/stores/tradeStore", () => ({
    useTradeStore: jest.fn(),
}));

jest.mock("@/stores/orientationStore", () => ({
    useOrientationStore: jest.fn(),
}));

jest.mock("@/stores/clientStore", () => ({
    useClientStore: jest.fn(),
}));

jest.mock("@/stores/bottomSheetStore", () => ({
    useBottomSheetStore: jest.fn(),
}));

jest.mock("@/stores/tooltipStore", () => ({
    useTooltipStore: jest.fn(),
}));

describe("StakeField", () => {
    const mockShowTooltip = jest.fn();
    const mockHideTooltip = jest.fn();
    const mockSetBottomSheet = jest.fn();
    const mockSetStake = jest.fn();
    const mockHandleError = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Default store mocks
        (useTooltipStore as jest.MockedFunction<typeof useTooltipStore>).mockReturnValue({
            showTooltip: mockShowTooltip,
            hideTooltip: mockHideTooltip,
        });
        (useTradeStore as jest.MockedFunction<typeof useTradeStore>).mockReturnValue({
            stake: "100",
            setStake: mockSetStake,
            isConfigLoading: false,
            productConfig: {
                data: {
                    validations: {
                        stake: {
                            min: "1",
                            max: "50000",
                        },
                    },
                },
            },
        });

        (useOrientationStore as jest.MockedFunction<typeof useOrientationStore>).mockReturnValue({
            isLandscape: false,
        });

        (useClientStore as jest.MockedFunction<typeof useClientStore>).mockReturnValue({
            currency: "USD",
        });

        (useBottomSheetStore as jest.MockedFunction<typeof useBottomSheetStore>).mockReturnValue({
            setBottomSheet: mockSetBottomSheet,
        });
    });

    // Helper function to render with default props
    const renderWithProps = (props = {}) => {
        const defaultProps = {
            stake: "100",
            setStake: mockSetStake,
            productConfig: {
                data: {
                    validations: {
                        stake: {
                            min: "1",
                            max: "50000",
                        },
                    },
                },
            },
            currency: "USD",
            handleError: mockHandleError,
            ...props,
        };
        return render(<StakeField {...defaultProps} />);
    };

    describe("Loading State", () => {
        it("should show skeleton loader when config is loading", () => {
            renderWithProps({
                isConfigLoading: true,
                productConfig: null,
            });

            const skeleton = screen.getByTestId("stake-field-skeleton");
            expect(skeleton).toBeInTheDocument();
            expect(screen.queryByTestId("trade-param")).not.toBeInTheDocument();
        });

        it("should show stake value when not loading", () => {
            renderWithProps();

            const param = screen.getByTestId("trade-param");
            expect(param).toBeInTheDocument();
            expect(param).toHaveAttribute("data-label", "Stake");
            expect(param).toHaveAttribute("data-value", "100 USD");
            expect(screen.queryByTestId("stake-field-skeleton")).not.toBeInTheDocument();
        });
    });

    describe("Error State", () => {
        it("should display N/A when productConfig is null", () => {
            renderWithProps({
                productConfig: null,
            });

            const param = screen.getByTestId("trade-param");
            expect(param).toHaveAttribute("data-value", "N/A");
            expect(param.className).toContain("opacity-50");
            expect(param.className).toContain("cursor-not-allowed");
        });

        it("should not trigger click actions when productConfig is null", () => {
            renderWithProps({
                productConfig: null,
            });

            fireEvent.click(screen.getByTestId("trade-param"));
            expect(mockSetBottomSheet).not.toHaveBeenCalled();
        });

        it("should not show increment/decrement buttons when productConfig is null in landscape mode", () => {
            (
                useOrientationStore as jest.MockedFunction<typeof useOrientationStore>
            ).mockReturnValue({
                isLandscape: true,
            });

            renderWithProps({
                productConfig: null,
            });

            expect(screen.queryByLabelText("Increase stake")).not.toBeInTheDocument();
            expect(screen.queryByLabelText("Decrease stake")).not.toBeInTheDocument();
            expect(screen.getByText("N/A")).toBeInTheDocument();
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
            renderWithProps();

            fireEvent.click(screen.getByTestId("trade-param"));

            expect(mockSetBottomSheet).toHaveBeenCalledWith(true, "stake", "400px");
        });

        it("should wrap in mobile trade field card", () => {
            renderWithProps();

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

        it("should show input field and increment/decrement buttons", () => {
            renderWithProps();

            expect(screen.getByLabelText("Stake amount")).toBeInTheDocument();
            expect(screen.getByLabelText("Decrease stake")).toBeInTheDocument();
            expect(screen.getByLabelText("Increase stake")).toBeInTheDocument();
        });

        it("should update isSelected state when clicked", () => {
            renderWithProps();

            const container = screen.getByTestId("desktop-trade-field-card")
                .firstChild as HTMLElement;
            expect(container.parentElement).toHaveAttribute("data-selected", "false");

            fireEvent.click(container);
            expect(container.parentElement).toHaveAttribute("data-selected", "true");

            // Blur should unselect
            fireEvent.blur(container);
            expect(container.parentElement).toHaveAttribute("data-selected", "false");
        });

        it("should handle increment/decrement with validation", () => {
            renderWithProps();

            // Test increment (step = 1)
            fireEvent.click(screen.getByLabelText("Increase stake"));
            expect(mockSetStake).toHaveBeenCalledWith("101"); // 100 + 1

            // Test decrement (step = 1)
            fireEvent.click(screen.getByLabelText("Decrease stake"));
            expect(mockSetStake).toHaveBeenCalledWith("99"); // 100 - 1
        });

        it("should show error state and tooltip when validation fails", () => {
            renderWithProps();

            const input = screen.getByLabelText("Stake amount");
            fireEvent.change(input, { target: { value: "" } }); // Empty value triggers error

            const card = screen.getByTestId("desktop-trade-field-card");
            expect(card).toHaveAttribute("data-error", "true");

            // Verify tooltip is shown with error message
            expect(mockShowTooltip).toHaveBeenCalledWith(
                "Please enter an amount",
                expect.any(Object),
                "error"
            );

            // Verify tooltip is hidden when valid value is entered
            fireEvent.change(input, { target: { value: "100" } });
            expect(mockHideTooltip).toHaveBeenCalled();
        });
    });

    describe("Error Callback", () => {
        beforeEach(() => {
            (
                useOrientationStore as jest.MockedFunction<typeof useOrientationStore>
            ).mockReturnValue({
                isLandscape: true,
            });
        });

        it("should call handleError with true and error message when value is empty", () => {
            // Create a fresh mock for this test
            const localMockHandleError = jest.fn();

            // Set landscape mode for input field
            (
                useOrientationStore as jest.MockedFunction<typeof useOrientationStore>
            ).mockReturnValue({
                isLandscape: true,
            });

            // Render with our local mock
            render(
                <StakeField
                    stake="100"
                    setStake={mockSetStake}
                    productConfig={{
                        data: {
                            validations: {
                                stake: {
                                    min: "1",
                                    max: "50000",
                                },
                            },
                        },
                    }}
                    currency="USD"
                    handleError={localMockHandleError}
                />
            );

            // Get the input field
            const input = screen.getByLabelText("Stake amount");

            // Create a proper change event
            const changeEvent = {
                target: {
                    value: "",
                    selectionStart: 0,
                },
            };

            // Directly trigger the empty value validation
            fireEvent.change(input, changeEvent);

            // Verify our local mock was called with the correct parameters
            expect(localMockHandleError).toHaveBeenCalledWith(true, "Please enter an amount");
        });

        it("should call handleError with true and error message when value is below minimum", () => {
            renderWithProps({
                productConfig: {
                    data: {
                        validations: {
                            stake: {
                                min: "10",
                                max: "50000",
                            },
                        },
                    },
                },
            });

            // Clear mock calls from initial render
            mockHandleError.mockClear();

            // Trigger below minimum error
            const input = screen.getByLabelText("Stake amount");
            fireEvent.change(input, { target: { value: "5" } });

            // Verify callback was called with correct params
            expect(mockHandleError).toHaveBeenCalledWith(
                true,
                expect.stringContaining("Minimum stake")
            );
        });

        it("should call handleError with true and error message when value is above maximum", () => {
            // Clear mock calls before rendering
            mockHandleError.mockClear();

            renderWithProps({
                productConfig: {
                    data: {
                        validations: {
                            stake: {
                                min: "1",
                                max: "1000",
                            },
                        },
                    },
                },
            });

            // Trigger above maximum error
            const input = screen.getByLabelText("Stake amount");
            fireEvent.change(input, { target: { value: "2000" } });

            // Verify callback was called with correct params - match the actual error message format
            expect(mockHandleError).toHaveBeenCalledWith(
                true,
                expect.stringContaining("Minimum stake of 1 USD and maximum stake of 1000 USD")
            );
        });

        it("should call handleError with false and null when value is valid", () => {
            // Clear mock calls before rendering
            mockHandleError.mockClear();

            // Render with a starting value that's different from what we'll enter
            renderWithProps({
                stake: "50",
            });

            // Enter valid value that's different from the initial value
            const input = screen.getByLabelText("Stake amount");
            fireEvent.change(input, { target: { value: "100" } });

            // Verify callback was called with correct params
            expect(mockHandleError).toHaveBeenCalledWith(false, null);
        });

        it("should call handleError during increment/decrement operations", () => {
            // Clear mock calls before rendering
            mockHandleError.mockClear();

            renderWithProps();

            // Test increment - clear mock first to ensure we only capture the increment call
            mockHandleError.mockClear();
            fireEvent.click(screen.getByLabelText("Increase stake"));
            expect(mockHandleError).toHaveBeenCalledWith(false, null);

            // Test decrement - clear mock first to ensure we only capture the decrement call
            mockHandleError.mockClear();
            fireEvent.click(screen.getByLabelText("Decrease stake"));
            expect(mockHandleError).toHaveBeenCalledWith(false, null);
        });

        it("should not throw errors when handleError is not provided", () => {
            // Create props without handleError
            const testProps = {
                stake: "100",
                setStake: mockSetStake,
                productConfig: {
                    data: {
                        validations: {
                            stake: {
                                min: "1",
                                max: "50000",
                            },
                        },
                    },
                },
                currency: "USD",
            };

            // Render without handleError prop
            render(<StakeField {...testProps} />);

            // This should not throw an error
            const input = screen.getByLabelText("Stake amount");
            expect(() => {
                fireEvent.change(input, { target: { value: "" } });
            }).not.toThrow();
        });
    });

    describe("Handler Props", () => {
        it("should apply className when provided", () => {
            renderWithProps({
                className: "custom-class",
            });

            // In portrait mode, check TradeParam
            expect(screen.getByTestId("trade-param").className).toContain("custom-class");

            // In landscape mode, check container
            (
                useOrientationStore as jest.MockedFunction<typeof useOrientationStore>
            ).mockReturnValue({
                isLandscape: true,
            });

            renderWithProps({
                className: "custom-class",
            });

            const container = screen.getByTestId("desktop-trade-field-card")
                .firstChild as HTMLElement;
            expect(container.className).toContain("custom-class");
        });

        it("should use custom onIncrement handler when provided", () => {
            const mockIncrement = jest.fn();

            (
                useOrientationStore as jest.MockedFunction<typeof useOrientationStore>
            ).mockReturnValue({
                isLandscape: true,
            });

            renderWithProps({
                onIncrement: mockIncrement,
            });

            // Click increment button
            fireEvent.click(screen.getByLabelText("Increase stake"));

            // Verify custom handler was called
            expect(mockIncrement).toHaveBeenCalled();
            // Default handler should not be called
            expect(mockSetStake).not.toHaveBeenCalled();
        });

        it("should use custom onDecrement handler when provided", () => {
            const mockDecrement = jest.fn();

            (
                useOrientationStore as jest.MockedFunction<typeof useOrientationStore>
            ).mockReturnValue({
                isLandscape: true,
            });

            renderWithProps({
                onDecrement: mockDecrement,
            });

            // Click decrement button
            fireEvent.click(screen.getByLabelText("Decrease stake"));

            // Verify custom handler was called
            expect(mockDecrement).toHaveBeenCalled();
            // Default handler should not be called
            expect(mockSetStake).not.toHaveBeenCalled();
        });

        it("should use custom onMobileClick handler when provided", () => {
            const mockMobileClick = jest.fn();

            renderWithProps({
                onMobileClick: mockMobileClick,
            });

            // Click mobile card
            fireEvent.click(screen.getByTestId("trade-param"));

            // Verify custom handler was called
            expect(mockMobileClick).toHaveBeenCalled();
            // Default handler should not be called
            expect(mockSetBottomSheet).not.toHaveBeenCalled();
        });
    });
});
