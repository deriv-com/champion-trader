import {
    updateDurationRanges,
    formatDuration,
    generateDurationValues,
    getSpecialCaseKey,
    isValidDuration,
    getDefaultDuration,
    parseDuration,
    convertHourToMinutes,
    formatDurationDisplay,
    SPECIAL_HOUR_CASES,
} from "../duration";
import type { ProductConfigResponse } from "@/api/services/product/types";

describe("duration utils", () => {
    // Default config for tests
    const defaultConfig: ProductConfigResponse = {
        data: {
            defaults: {
                id: "test",
                duration: 5,
                duration_unit: "minutes",
                allow_equals: true,
                stake: 10,
            },
            validations: {
                durations: {
                    supported_units: ["ticks", "seconds", "minutes", "hours", "days"],
                    ticks: { min: 1, max: 10 },
                    seconds: { min: 15, max: 120 },
                    days: { min: 1, max: 30 },
                },
                stake: {
                    min: "1",
                    max: "100",
                },
                payout: {
                    min: "1",
                    max: "100",
                },
            },
        },
    };

    // Reset duration ranges before each test
    beforeEach(() => {
        updateDurationRanges(defaultConfig);
    });

    describe("updateDurationRanges", () => {
        it("updates duration ranges from config", () => {
            // Verify initial ranges from beforeEach
            expect(generateDurationValues("ticks")).toHaveLength(10);
            expect(generateDurationValues("seconds")).toHaveLength(45); // 59 - 15 + 1 = 45 values (max capped at 59)

            // Update with different ranges
            updateDurationRanges({
                ...defaultConfig,
                data: {
                    ...defaultConfig.data,
                    validations: {
                        ...defaultConfig.data.validations,
                        durations: {
                            ...defaultConfig.data.validations.durations,
                            ticks: { min: 1, max: 5 },
                            seconds: { min: 10, max: 30 },
                        },
                    },
                },
            });

            // Verify ranges were updated
            expect(generateDurationValues("ticks")).toHaveLength(5);
            expect(generateDurationValues("seconds")).toHaveLength(21); // 30 - 10 + 1 = 21 values
        });
    });

    describe("formatDuration", () => {
        it("formats duration for SSE", () => {
            expect(formatDuration(5, "minutes")).toBe("5m");
            expect(formatDuration(1, "hours")).toBe("1h");
            expect(formatDuration(10, "ticks")).toBe("10t");
            expect(formatDuration(30, "seconds")).toBe("30s");
            expect(formatDuration(2, "days")).toBe("2d");
        });
    });

    describe("generateDurationValues", () => {
        it("generates values for regular duration types", () => {
            // Since minutes are derived from seconds range (15-120)
            // Minutes should be 1-2 since 120 seconds = 2 minutes
            expect(generateDurationValues("minutes")).toHaveLength(2);

            // Ticks are directly from config
            expect(generateDurationValues("ticks")).toHaveLength(10);

            // Seconds are capped at 59 by duration-config-adapter
            expect(generateDurationValues("seconds")).toHaveLength(45); // 59 - 15 + 1 = 45 values
        });

        it("handles special hour cases", () => {
            expect(generateDurationValues("minutes", 24)).toEqual([0]);
        });

        it("returns empty array for invalid type", () => {
            expect(generateDurationValues("invalid" as any)).toEqual([]);
        });
    });

    describe("SPECIAL_HOUR_CASES", () => {
        it("defines special case for 24 hours", () => {
            expect(SPECIAL_HOUR_CASES[24]).toBeDefined();
            expect(SPECIAL_HOUR_CASES[24].key).toBe("24h");
            expect(SPECIAL_HOUR_CASES[24].minutes).toEqual([0]);
        });

        it("is used in generateDurationValues", () => {
            // When hour is 24, only 0 minutes should be available
            expect(generateDurationValues("minutes", 24)).toEqual([0]);

            // For other hours, all minutes should be available
            expect(generateDurationValues("minutes", 1)).toHaveLength(60);
        });
    });

    describe("getSpecialCaseKey", () => {
        it("returns special case key for known hours", () => {
            expect(getSpecialCaseKey(24)).toBe("24h");
        });

        it("returns empty string for unknown hours", () => {
            expect(getSpecialCaseKey(1)).toBe("");
            expect(getSpecialCaseKey(undefined)).toBe("");
        });
    });

    describe("isValidDuration", () => {
        it("validates duration values", () => {
            // Since minutes are derived from seconds (15-120),
            // 1-2 minutes are valid
            expect(isValidDuration("minutes", 1)).toBe(true);
            expect(isValidDuration("minutes", 2)).toBe(true);
            expect(isValidDuration("minutes", 3)).toBe(false);

            // Hours are not available since max seconds is 120
            expect(isValidDuration("hours", 1)).toBe(false);
            expect(isValidDuration("hours", 24)).toBe(false);
        });

        it("returns false for invalid type", () => {
            expect(isValidDuration("invalid" as any, 1)).toBe(false);
        });
    });

    describe("getDefaultDuration", () => {
        it("returns default duration for each type", () => {
            // Ticks are directly from config
            expect(getDefaultDuration("ticks")).toBe(1);

            // Minutes and hours are derived from seconds (15-120)
            // 1-2 minutes are available
            expect(getDefaultDuration("minutes")).toBe(1);

            // Hours are not available since max seconds is 120
            expect(getDefaultDuration("hours")).toBe(0);
        });

        it("returns 0 for invalid type", () => {
            expect(getDefaultDuration("invalid" as any)).toBe(0);
        });
    });

    describe("parseDuration", () => {
        it("parses regular duration strings", () => {
            expect(parseDuration("5 minutes")).toEqual({
                value: "5",
                type: "minutes",
            });
            expect(parseDuration("1 hours")).toEqual({
                value: "1",
                type: "hours",
            });
        });

        it("handles hour:minute format", () => {
            expect(parseDuration("1:30 hours")).toEqual({
                value: "90",
                type: "minutes",
            });
            expect(parseDuration("2:15 hours")).toEqual({
                value: "135",
                type: "minutes",
            });
        });
    });

    describe("convertHourToMinutes", () => {
        it("converts hours to minutes", () => {
            expect(convertHourToMinutes("1:30")).toBe(90);
            expect(convertHourToMinutes("2:15")).toBe(135);
            expect(convertHourToMinutes("1:00")).toBe(60);
        });

        it("handles hours without minutes", () => {
            expect(convertHourToMinutes("2")).toBe(120);
        });
    });

    describe("formatDurationDisplay", () => {
        it("formats regular durations", () => {
            expect(formatDurationDisplay("1 ticks")).toBe("1 tick");
            expect(formatDurationDisplay("2 ticks")).toBe("2 ticks");
            expect(formatDurationDisplay("1 minutes")).toBe("1 minute");
            expect(formatDurationDisplay("5 minutes")).toBe("5 minutes");
        });

        it("formats hour durations", () => {
            expect(formatDurationDisplay("1:00 hours")).toBe("1 hour");
            expect(formatDurationDisplay("2:00 hours")).toBe("2 hours");
            expect(formatDurationDisplay("1:30 hours")).toBe("1 hour 30 minutes");
            expect(formatDurationDisplay("2:01 hours")).toBe("2 hours 1 minute");
        });

        it("handles edge cases", () => {
            expect(formatDurationDisplay("invalid")).toBe("invalid");
        });
    });
});
