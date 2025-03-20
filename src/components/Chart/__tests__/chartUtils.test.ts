import {
    sortAndDeduplicate,
    formatPrice,
    calculatePercentageChange,
    shouldAutoScroll,
} from "../Helpers/chartUtils";

describe("Chart Utilities", () => {
    describe("sortAndDeduplicate", () => {
        it("sorts data points by timestamp", () => {
            const data = [
                { timestamp: 300, value: 3 },
                { timestamp: 100, value: 1 },
                { timestamp: 200, value: 2 },
            ];

            const result = sortAndDeduplicate(data);

            expect(result).toEqual([
                { timestamp: 100, value: 1 },
                { timestamp: 200, value: 2 },
                { timestamp: 300, value: 3 },
            ]);
        });

        it("removes duplicate timestamps", () => {
            const data = [
                { timestamp: 100, value: 1 },
                { timestamp: 200, value: 2 },
                { timestamp: 100, value: 3 }, // Duplicate timestamp with different value
            ];

            const result = sortAndDeduplicate(data);

            expect(result).toHaveLength(2);
            expect(result).toEqual([
                { timestamp: 100, value: 3 }, // Last value for timestamp 100 is kept
                { timestamp: 200, value: 2 },
            ]);
        });

        it("handles empty arrays", () => {
            const data: Array<{ timestamp: number; value: number }> = [];
            const result = sortAndDeduplicate(data);
            expect(result).toEqual([]);
        });
    });

    describe("formatPrice", () => {
        it("formats price with default 2 decimal places", () => {
            expect(formatPrice(123.456)).toBe("123.46");
            expect(formatPrice(123)).toBe("123.00");
            expect(formatPrice(123.4)).toBe("123.40");
        });

        it("formats price with specified decimal places", () => {
            expect(formatPrice(123.456, 3)).toBe("123.456");
            expect(formatPrice(123, 0)).toBe("123");
            expect(formatPrice(123.4, 1)).toBe("123.4");
        });
    });

    describe("calculatePercentageChange", () => {
        it("calculates positive percentage change", () => {
            expect(calculatePercentageChange(100, 110)).toBe("+10.00%");
            expect(calculatePercentageChange(50, 75)).toBe("+50.00%");
        });

        it("calculates negative percentage change", () => {
            expect(calculatePercentageChange(100, 90)).toBe("-10.00%");
            expect(calculatePercentageChange(50, 25)).toBe("-50.00%");
        });

        it("handles zero old price", () => {
            expect(calculatePercentageChange(0, 100)).toBe("0%");
        });

        it("handles zero change", () => {
            expect(calculatePercentageChange(100, 100)).toBe("0.00%");
        });
    });

    describe("shouldAutoScroll", () => {
        it("returns true when enough time has passed since last interaction", () => {
            const now = Date.now();
            const lastInteraction = now - 6000; // 6 seconds ago

            // Mock Date.now to return a fixed value
            const originalDateNow = Date.now;
            Date.now = jest.fn(() => now);

            expect(shouldAutoScroll(lastInteraction)).toBe(true);

            // Restore original Date.now
            Date.now = originalDateNow;
        });

        it("returns false when not enough time has passed", () => {
            const now = Date.now();
            const lastInteraction = now - 3000; // 3 seconds ago

            // Mock Date.now to return a fixed value
            const originalDateNow = Date.now;
            Date.now = jest.fn(() => now);

            expect(shouldAutoScroll(lastInteraction)).toBe(false);

            // Restore original Date.now
            Date.now = originalDateNow;
        });

        it("respects custom threshold", () => {
            const now = Date.now();
            const lastInteraction = now - 3000; // 3 seconds ago

            // Mock Date.now to return a fixed value
            const originalDateNow = Date.now;
            Date.now = jest.fn(() => now);

            // With 2 second threshold, should return true
            expect(shouldAutoScroll(lastInteraction, 2000)).toBe(true);

            // Restore original Date.now
            Date.now = originalDateNow;
        });
    });
});
