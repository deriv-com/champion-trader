import { render, screen, fireEvent, act } from "@testing-library/react";
import { StakeController } from "../StakeController";
import { useTradeStore } from "@/stores/tradeStore";
import { useClientStore } from "@/stores/clientStore";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { useOrientationStore } from "@/stores/orientationStore";
import { createSSEConnection } from "@/api/base/sse";
import { validateStake } from "../utils/validation";
import { getStakeConfig } from "@/adapters/stake-config-adapter";

// Mock dependencies
jest.mock("@/adapters/stake-config-adapter");
jest.mock("@/api/base/sse", () => ({
    createSSEConnection: jest.fn(),
}));
jest.mock("@/utils/stake");
jest.mock("../utils/validation");
jest.mock("@/adapters/stake-config-adapter");
jest.mock("@/utils/stake", () => ({
    parseStakeAmount: (value: string) => Number(value),
}));
jest.mock("@/utils/duration", () => ({
    parseDuration: () => ({ value: "1", type: "m" }),
    formatDuration: () => "1m",
}));
jest.mock("@/config/tradeTypes", () => ({
    tradeTypeConfigs: {
        rise_fall: {
            buttons: [
                { actionName: "RISE", contractType: "CALL" },
                { actionName: "FALL", contractType: "PUT" },
            ],
        },
    },
}));

// Mock Zustand stores
jest.mock("@/stores/tradeStore", () => ({
    useTradeStore: jest.fn(),
}));

jest.mock("@/stores/clientStore", () => ({
    useClientStore: jest.fn(),
}));

jest.mock("@/stores/bottomSheetStore", () => ({
    useBottomSheetStore: jest.fn(),
}));

jest.mock("@/stores/orientationStore", () => ({
    useOrientationStore: jest.fn(),
}));

// Mock child components
jest.mock("@/components/ui/bottom-sheet-header", () => ({
    BottomSheetHeader: () => <div data-testid="bottom-sheet-header">Header</div>,
}));

jest.mock("@/components/ui/primary-button", () => ({
    PrimaryButton: ({ children, onClick, disabled }: any) => (
        <button data-testid="save-button" onClick={onClick} disabled={disabled}>
            {children}
        </button>
    ),
}));

jest.mock("../components/StakeInputLayout", () => ({
    StakeInputLayout: ({ value, onChange, error, errorMessage }: any) => (
        <div data-testid="stake-input-layout">
            <input
                data-testid="stake-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {error && <span data-testid="error-message">{errorMessage}</span>}
        </div>
    ),
}));

describe("StakeController", () => {
    const mockSetStake = jest.fn();
    const mockSetBottomSheet = jest.fn();
    const mockSetPayouts = jest.fn();
    const mockCleanup = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock store values
        (useTradeStore as jest.MockedFunction<typeof useTradeStore>).mockReturnValue({
            stake: "10",
            setStake: mockSetStake,
            trade_type: "rise_fall",
            duration: "1 minute",
            payouts: { max: 50000, values: {} },
            setPayouts: mockSetPayouts,
            productConfig: { data: { validations: { stake: { min: "1", max: "50000" } } } },
        } as any);

        (useClientStore as jest.MockedFunction<typeof useClientStore>).mockReturnValue({
            currency: "USD",
            token: "mock-token",
        } as any);

        (useBottomSheetStore as jest.MockedFunction<typeof useBottomSheetStore>).mockReturnValue({
            setBottomSheet: mockSetBottomSheet,
        } as any);

        (useOrientationStore as jest.MockedFunction<typeof useOrientationStore>).mockReturnValue({
            isLandscape: false,
        } as any);

        // Mock SSE connection
        (createSSEConnection as jest.Mock).mockReturnValue(mockCleanup);

        // Mock validation and stake config to succeed by default
        (validateStake as jest.Mock).mockImplementation((params) => {
            if (!params.amount) {
                return { error: true, message: "Please enter an amount" };
            }
            if (params.amount < params.minStake) {
                return {
                    error: true,
                    message: `Minimum stake is ${params.minStake} ${params.currency}`,
                };
            }
            if (params.amount > params.maxStake) {
                return { error: true, message: `Amount exceeds maximum stake` };
            }
            return { error: false };
        });

        // Mock stake config to succeed by default
        (getStakeConfig as jest.Mock).mockReturnValue({ min: 1, max: 50000, step: 1 });
    });

    describe("Portrait Mode (Mobile)", () => {
        it("renders with bottom sheet controls", () => {
            render(<StakeController />);
            expect(screen.getByTestId("bottom-sheet-header")).toBeInTheDocument();
            expect(screen.getByTestId("save-button")).toBeInTheDocument();
            expect(screen.getByTestId("stake-input")).toHaveValue("10");
        });

        it("updates local stake value when input changes", () => {
            render(<StakeController />);
            fireEvent.change(screen.getByTestId("stake-input"), { target: { value: "20" } });
            expect(screen.getByTestId("stake-input")).toHaveValue("20");
            // Should not update global stake yet
            expect(mockSetStake).not.toHaveBeenCalled();
        });

        it("validates stake and shows error messages", () => {
            render(<StakeController />);

            // Empty input
            fireEvent.change(screen.getByTestId("stake-input"), { target: { value: "" } });
            expect(screen.getByTestId("error-message")).toHaveTextContent("Please enter an amount");
            expect(screen.getByTestId("save-button")).toBeDisabled();

            // Below minimum
            fireEvent.change(screen.getByTestId("stake-input"), { target: { value: "0.5" } });
            expect(screen.getByTestId("error-message")).toHaveTextContent("Minimum stake is 1 USD");
            expect(screen.getByTestId("save-button")).toBeDisabled();

            // Above maximum
            fireEvent.change(screen.getByTestId("stake-input"), { target: { value: "60000" } });
            expect(screen.getByTestId("error-message")).toHaveTextContent(
                "Amount exceeds maximum stake"
            );
            expect(screen.getByTestId("save-button")).toBeDisabled();
        });

        it("saves stake and closes bottom sheet when save button is clicked", async () => {
            render(<StakeController />);

            // Change input
            fireEvent.change(screen.getByTestId("stake-input"), { target: { value: "20" } });

            // Wait for debounce
            await act(async () => {
                await new Promise((resolve) => setTimeout(resolve, 500));
            });

            // Click save
            fireEvent.click(screen.getByTestId("save-button"));

            // Should update global stake and close bottom sheet
            expect(mockSetStake).toHaveBeenCalledWith("20");
            expect(mockSetBottomSheet).toHaveBeenCalledWith(false);
        });

        it("disables save button when stake hasn't changed", async () => {
            render(<StakeController />);

            // Change input to same value
            fireEvent.change(screen.getByTestId("stake-input"), { target: { value: "10" } });

            // Wait for debounce
            await act(async () => {
                await new Promise((resolve) => setTimeout(resolve, 500));
            });

            // Save button should be disabled
            expect(screen.getByTestId("save-button")).toBeDisabled();
        });
    });

    describe("Landscape Mode (Desktop)", () => {
        beforeEach(() => {
            (
                useOrientationStore as jest.MockedFunction<typeof useOrientationStore>
            ).mockReturnValue({
                isLandscape: true,
            } as any);
        });

        it("renders without bottom sheet controls", () => {
            render(<StakeController />);
            expect(screen.queryByTestId("bottom-sheet-header")).not.toBeInTheDocument();
            expect(screen.queryByTestId("save-button")).not.toBeInTheDocument();
            expect(screen.getByTestId("stake-input")).toHaveValue("10");
        });

        it("updates global stake after debounce when input changes", async () => {
            render(<StakeController />);

            // Change input
            fireEvent.change(screen.getByTestId("stake-input"), { target: { value: "20" } });

            // Should not update global stake immediately
            expect(mockSetStake).not.toHaveBeenCalled();

            // Wait for debounce
            await act(async () => {
                await new Promise((resolve) => setTimeout(resolve, 500));
            });

            // Should update global stake after debounce
            expect(mockSetStake).toHaveBeenCalledWith("20");
        });

        it("doesn't update global stake when validation fails", async () => {
            render(<StakeController />);

            // Change input to invalid value
            fireEvent.change(screen.getByTestId("stake-input"), { target: { value: "60000" } });

            // Wait for debounce
            await act(async () => {
                await new Promise((resolve) => setTimeout(resolve, 500));
            });

            // Should not update global stake
            expect(mockSetStake).not.toHaveBeenCalled();
        });
    });

    describe("SSE Connection Management", () => {
        it("establishes SSE connections for each trade type button", () => {
            render(<StakeController />);

            // Should establish connections for both buttons
            expect(createSSEConnection).toHaveBeenCalledTimes(2);

            // Check first call parameters
            expect(createSSEConnection).toHaveBeenCalledWith(
                expect.objectContaining({
                    params: expect.objectContaining({
                        trade_type: "CALL",
                        currency: "USD",
                        payout: "10",
                    }),
                    headers: { Authorization: "Bearer mock-token" },
                })
            );

            // Check second call parameters
            expect(createSSEConnection).toHaveBeenCalledWith(
                expect.objectContaining({
                    params: expect.objectContaining({
                        trade_type: "PUT",
                        currency: "USD",
                        payout: "10",
                    }),
                    headers: { Authorization: "Bearer mock-token" },
                })
            );
        });

        it("updates payouts when receiving SSE messages", () => {
            render(<StakeController />);

            // Get onMessage callback from first call
            const onMessage = (createSSEConnection as jest.Mock).mock.calls[0][0].onMessage;

            // Simulate message
            act(() => {
                onMessage({ price: "100" });
            });

            // Should update payouts
            expect(mockSetPayouts).toHaveBeenCalledWith(
                expect.objectContaining({
                    values: expect.any(Object),
                })
            );
        });

        it("cleans up SSE connections on unmount", () => {
            const { unmount } = render(<StakeController />);

            // Unmount component
            unmount();

            // Should clean up connections
            expect(mockCleanup).toHaveBeenCalledTimes(2);
        });
    });

    describe("Null ProductConfig Handling", () => {
        beforeEach(() => {
            // Mock store with null productConfig
            (useTradeStore as jest.MockedFunction<typeof useTradeStore>).mockReturnValue({
                stake: "10",
                setStake: mockSetStake,
                trade_type: "rise_fall",
                duration: "1 minute",
                payouts: { max: 50000, values: {} },
                setPayouts: mockSetPayouts,
                productConfig: null,
            } as any);
        });

        it("doesn't establish SSE connections when productConfig is null", () => {
            render(<StakeController />);

            // Should not establish connections
            expect(createSSEConnection).not.toHaveBeenCalled();
        });

        it("doesn't render stake input when productConfig is null", () => {
            render(<StakeController />);

            // Should not render stake input
            expect(screen.queryByTestId("stake-input")).not.toBeInTheDocument();

            // Should not update global stake
            expect(mockSetStake).not.toHaveBeenCalled();
        });
    });
});
