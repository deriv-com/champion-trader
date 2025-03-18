import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useTradeActions } from "../useTradeActions";
import { useBuyContract, useSellContract } from "../contract/useContract";
import { useTradeStore } from "@/stores/tradeStore";
import { useClientStore } from "@/stores/clientStore";
import { useToastStore } from "@/stores/toastStore";

// Mock the hooks
jest.mock("../contract/useContract", () => ({
    useBuyContract: jest.fn(),
    useSellContract: jest.fn(),
}));

jest.mock("@/stores/tradeStore", () => ({
    useTradeStore: jest.fn(),
}));

jest.mock("@/stores/clientStore", () => ({
    useClientStore: jest.fn(),
}));

jest.mock("@/stores/toastStore", () => ({
    useToastStore: jest.fn(),
}));

jest.mock("@/utils/uuid", () => ({
    generateUUID: jest.fn(() => "test-uuid"),
}));

// Test component that uses the hook
const TestComponent = () => {
    const actions = useTradeActions();

    return (
        <div>
            <button data-testid="buy-rise" onClick={() => actions.buy_rise()}>
                Buy Rise
            </button>
            <button
                data-testid="sell-contract"
                onClick={() => actions.sell_contract("test-contract-id")}
            >
                Sell Contract
            </button>
        </div>
    );
};

describe("useTradeActions", () => {
    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Mock store values
        (useTradeStore as jest.Mock).mockReturnValue({
            trade_type: "rise_fall",
            stake: "100",
            duration: "5 minutes",
            instrument: "R_100",
            allowEquals: false,
            payouts: {
                values: {
                    buy_rise: "200",
                    buy_fall: "200",
                },
            },
            setContractDetails: jest.fn(),
        });

        (useClientStore as jest.Mock).mockReturnValue({
            account_uuid: "test-account-uuid",
        });

        (useToastStore as jest.Mock).mockReturnValue({
            toast: jest.fn(),
        });
    });

    it("should call buyContractMutate with correct parameters when buy_rise is called", async () => {
        // Mock the buyContractMutate function
        const buyContractMutateMock = jest.fn().mockResolvedValue({
            data: {
                contract_id: "test-contract-id",
                product_id: "rise_fall",
                buy_price: "100",
                buy_time: 123456789,
                contract_details: {
                    contract_start_time: 123456789,
                    contract_expiry_time: 123456789 + 300,
                    entry_tick_time: 123456789,
                    entry_spot: "100",
                    duration: 5,
                    duration_unit: "minutes",
                    allow_equals: false,
                    stake: "100",
                    bid_price: "100",
                    bid_price_currency: "USD",
                    variant: "rise",
                    barrier: "0",
                    is_expired: false,
                    is_valid_to_sell: true,
                    is_sold: false,
                    potential_payout: "200",
                },
            },
        });

        // Mock the useBuyContract hook
        (useBuyContract as jest.Mock).mockReturnValue({
            mutate: buyContractMutateMock,
        });

        // Mock the useSellContract hook
        (useSellContract as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
        });

        // Render the test component
        render(<TestComponent />);

        // Click the buy rise button
        fireEvent.click(screen.getByTestId("buy-rise"));

        // Wait for the async operation to complete
        await waitFor(() => {
            expect(buyContractMutateMock).toHaveBeenCalledWith({
                idempotency_key: "test-uuid",
                product_id: "rise_fall",
                proposal_details: {
                    instrument_id: "R_100",
                    duration: 5,
                    duration_unit: "minutes",
                    allow_equals: false,
                    stake: "100",
                    variant: "rise",
                    payout: "200",
                },
                account_uuid: "test-account-uuid",
            });
        });
    });

    it("should call sellContractMutate with correct parameters when sell_contract is called", async () => {
        // Mock the sellContractMutate function
        const sellContractMutateMock = jest.fn().mockResolvedValue({
            data: {
                contract_id: "test-contract-id",
                product_id: "rise_fall",
                buy_price: "100",
                buy_time: 123456789,
                sell_price: "150",
                sell_time: 123456789 + 150,
                profit: "50",
                contract_details: {
                    // Contract details
                },
            },
        });

        // Mock the useBuyContract hook
        (useBuyContract as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
        });

        // Mock the useSellContract hook
        (useSellContract as jest.Mock).mockReturnValue({
            mutate: sellContractMutateMock,
        });

        // Render the test component
        render(<TestComponent />);

        // Click the sell contract button
        fireEvent.click(screen.getByTestId("sell-contract"));

        // Wait for the async operation to complete
        await waitFor(() => {
            expect(sellContractMutateMock).toHaveBeenCalledWith({
                contract_id: "test-contract-id",
                account_uuid: "test-account-uuid",
            });
        });
    });
});
