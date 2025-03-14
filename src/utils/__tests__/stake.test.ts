import { parseStakeAmount, incrementStake, decrementStake } from "../stake";
import { getStakeConfig } from "@/adapters/stake-config-adapter";

// Mock the stake-config-adapter
jest.mock("@/adapters/stake-config-adapter", () => ({
    getStakeConfig: jest.fn(),
}));

describe("stake utils", () => {
    // Reset mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
        // Set default mock implementation
        (getStakeConfig as jest.Mock).mockReturnValue({
            min: 1,
            max: 100,
            step: 1,
        });
    });

    describe("parseStakeAmount", () => {
        it("parses numeric string correctly", () => {
            expect(parseStakeAmount("50")).toBe(50);
            expect(parseStakeAmount("10.5")).toBe(10.5);
            expect(parseStakeAmount("0")).toBe(0);
        });

        it("handles amount with currency format", () => {
            expect(parseStakeAmount("50 USD")).toBe(50);
            expect(parseStakeAmount("10.5 EUR")).toBe(10.5);
            expect(parseStakeAmount("1000 GBP")).toBe(1000);
        });

        it("returns NaN for invalid input", () => {
            expect(parseStakeAmount("invalid")).toBe(NaN);
            expect(parseStakeAmount("abc USD")).toBe(NaN);
        });
    });

    describe("incrementStake", () => {
        it("increments stake by step amount", () => {
            expect(incrementStake("50")).toBe("51");
            expect(incrementStake("10.5")).toBe("11.5");
        });

        it("handles stake with currency format", () => {
            expect(incrementStake("50 USD")).toBe("51");
            expect(incrementStake("10.5 EUR")).toBe("11.5");
        });

        it("respects maximum stake limit", () => {
            expect(incrementStake("99")).toBe("100");
            expect(incrementStake("100")).toBe("100");
        });

        it("uses custom step from config", () => {
            (getStakeConfig as jest.Mock).mockReturnValue({
                min: 1,
                max: 100,
                step: 5,
            });

            expect(incrementStake("10")).toBe("15");
            expect(incrementStake("95")).toBe("100");
            expect(incrementStake("98")).toBe("100");
        });
    });

    describe("decrementStake", () => {
        it("decrements stake by step amount", () => {
            expect(decrementStake("50")).toBe("49");
            expect(decrementStake("10.5")).toBe("9.5");
        });

        it("handles stake with currency format", () => {
            expect(decrementStake("50 USD")).toBe("49");
            expect(decrementStake("10.5 EUR")).toBe("9.5");
        });

        it("respects minimum stake limit", () => {
            expect(decrementStake("2")).toBe("1");
            expect(decrementStake("1")).toBe("1");
        });

        it("uses custom step from config", () => {
            (getStakeConfig as jest.Mock).mockReturnValue({
                min: 1,
                max: 100,
                step: 5,
            });

            expect(decrementStake("15")).toBe("10");
            expect(decrementStake("6")).toBe("1");
            expect(decrementStake("4")).toBe("1");
        });
    });
});
