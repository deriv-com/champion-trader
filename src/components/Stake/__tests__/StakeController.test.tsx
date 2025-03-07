import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { StakeController } from "../StakeController";
import { useTradeStore } from "@/stores/tradeStore";
import { useClientStore } from "@/stores/clientStore";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { useOrientationStore } from "@/stores/orientationStore";
import { getStakeConfig } from "@/adapters/stake-config-adapter";
import { createSSEConnection } from "@/services/api/sse/createSSEConnection";
import { validateStake } from "../utils/validation";
import { parseDuration, formatDuration } from "@/utils/duration";
import { parseStakeAmount } from "@/utils/stake";

// Mock dependencies
jest.mock("@/adapters/stake-config-adapter");
jest.mock("@/services/api/sse/createSSEConnection");
jest.mock("@/utils/stake");
jest.mock("../utils/validation");
jest.mock("@/utils/duration");
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
    StakeInputLayout: ({ value, onChange, error, errorMessage, isDesktop }: any) => (
        <div data-testid="stake-input-layout">
            <input
                data-testid="stake-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {error && <span data-testid="error-message">{errorMessage}</span>}
            <span data-testid="layout-mode">{isDesktop ? "desktop" : "mobile"}</span>
        </div>
    ),
}));

// Mock debounce to execute immediately in tests
jest.mock("@/hooks/useDebounce", () => ({
    useDebounce: (value: any, setValue: any) => {
        React.useEffect(() => {
            setValue(value);
        }, [value, setValue]);
    },
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

        // Mock utility functions
        (getStakeConfig as jest.Mock).mockReturnValue({
            min: 1,
            max: 50000,
            step: 1,
        });

        (parseStakeAmount as jest.Mock).mockImplementation((value) => Number(value));
        (validateStake as jest.Mock).mockReturnValue({ error: false });
        (parseDuration as jest.Mock).mockReturnValue({ value: "1", type: "minute" });
        (formatDuration as jest.Mock).mockReturnValue("1m");
        (createSSEConnection as jest.Mock).mockReturnValue(mockCleanup);
    });

    describe("Initial Rendering", () => {
        it("renders correctly in portrait mode", () => {
            render(<StakeController />);

            expect(screen.getByTestId("bottom-sheet-header")).toBeInTheDocument();
            expect(screen.getByTestId("stake-input-layout")).toBeInTheDocument();
            expect(screen.getByTestId("save-button")).toBeInTheDocument();
            expect(screen.getByTestId("layout-mode")).toHaveTextContent("mobile");
        });

        it("renders correctly in landscape mode", () => {
            (
                useOrientationStore as jest.MockedFunction<typeof useOrientationStore>
            ).mockReturnValue({
                isLandscape: true,
            } as any);

            render(<StakeController />);

            expect(screen.queryByTestId("bottom-sheet-header")).not.toBeInTheDocument();
            expect(screen.queryByTestId("save-button")).not.toBeInTheDocument();
            expect(screen.getByTestId("layout-mode")).toHaveTextContent("desktop");
        });

        it("initializes with correct stake value", () => {
            render(<StakeController />);
            expect(screen.getByTestId("stake-input")).toHaveValue("10");
        });
    });

    describe("Stake Input Handling", () => {
        it("validates empty input", () => {
            render(<StakeController />);

            fireEvent.change(screen.getByTestId("stake-input"), { target: { value: "" } });

            expect(screen.getByTestId("error-message")).toHaveTextContent("Please enter an amount");
        });

        it("validates input against min/max", () => {
            (validateStake as jest.Mock).mockReturnValueOnce({
                error: true,
                message: "Amount is below minimum stake",
            });

            render(<StakeController />);

            fireEvent.change(screen.getByTestId("stake-input"), { target: { value: "0.5" } });

            expect(validateStake).toHaveBeenCalledWith({
                amount: 0.5,
                minStake: 1,
                maxStake: 50000,
                currency: "USD",
            });
            expect(screen.getByTestId("error-message")).toHaveTextContent(
                "Amount is below minimum stake"
            );
        });

        it("updates stake immediately in landscape mode", () => {
            (
                useOrientationStore as jest.MockedFunction<typeof useOrientationStore>
            ).mockReturnValue({
                isLandscape: true,
            } as any);

            (validateStake as jest.Mock).mockReturnValue({ error: false });

            render(<StakeController />);

            fireEvent.change(screen.getByTestId("stake-input"), { target: { value: "20" } });

            expect(mockSetStake).toHaveBeenCalledWith("20");
        });

        it("prevents exceeding maximum stake", () => {
            (validateStake as jest.Mock).mockReturnValue({
                error: true,
                message: "Amount exceeds maximum stake",
            });

            render(<StakeController />);

            fireEvent.change(screen.getByTestId("stake-input"), { target: { value: "60000" } });

            expect(screen.getByTestId("error-message")).toHaveTextContent(
                "Amount exceeds maximum stake"
            );
            expect(mockSetStake).not.toHaveBeenCalled();
        });
    });

    describe("SSE Connection Management", () => {
        it("establishes SSE connections for each button", () => {
            render(<StakeController />);

            expect(createSSEConnection).toHaveBeenCalledTimes(2);
            expect(createSSEConnection).toHaveBeenCalledWith(
                expect.objectContaining({
                    params: expect.objectContaining({
                        trade_type: "CALL",
                    }),
                })
            );
            expect(createSSEConnection).toHaveBeenCalledWith(
                expect.objectContaining({
                    params: expect.objectContaining({
                        trade_type: "PUT",
                    }),
                })
            );
        });

        it("handles SSE messages correctly", () => {
            render(<StakeController />);

            const onMessage = (createSSEConnection as jest.Mock).mock.calls[0][0].onMessage;

            act(() => {
                onMessage({ price: "100" });
            });

            expect(mockSetPayouts).toHaveBeenCalledWith(
                expect.objectContaining({
                    max: 50000,
                    values: expect.any(Object),
                })
            );
        });

        it("handles SSE errors gracefully", () => {
            render(<StakeController />);

            const onError = (createSSEConnection as jest.Mock).mock.calls[0][0].onError;
            const error = new Error("Connection failed");

            act(() => {
                onError(error);
            });

            // Component should still be rendered and functional
            expect(screen.getByTestId("stake-input-layout")).toBeInTheDocument();
        });

        it("cleans up SSE connections on unmount", () => {
            const { unmount } = render(<StakeController />);
            unmount();
            expect(mockCleanup).toHaveBeenCalledTimes(2);
        });
    });

    describe("Save Functionality", () => {
        it("saves valid stake and closes bottom sheet", () => {
            (validateStake as jest.Mock).mockReturnValue({ error: false });

            render(<StakeController />);

            fireEvent.change(screen.getByTestId("stake-input"), { target: { value: "20" } });
            fireEvent.click(screen.getByTestId("save-button"));

            expect(mockSetStake).toHaveBeenCalledWith("20");
            expect(mockSetBottomSheet).toHaveBeenCalledWith(false);
        });

        it("prevents save when stake is invalid", () => {
            (validateStake as jest.Mock).mockReturnValue({
                error: true,
                message: "Invalid stake amount",
            });

            render(<StakeController />);

            fireEvent.change(screen.getByTestId("stake-input"), { target: { value: "0" } });
            fireEvent.click(screen.getByTestId("save-button"));

            expect(mockSetStake).not.toHaveBeenCalled();
            expect(mockSetBottomSheet).not.toHaveBeenCalled();
        });

        it("disables save button when stake is unchanged", () => {
            render(<StakeController />);
            expect(screen.getByTestId("save-button")).toBeDisabled();
        });
    });
});
