import {
    adaptDurationRanges,
    convertSecondsToDurationRanges,
    getAvailableDurationTypes,
} from "../duration-config-adapter";
import type { ProductConfigResponse } from "@/api/services/product/types";

describe("getAvailableDurationTypes", () => {
    const mockDurationTypes = [
        { label: "Ticks", value: "ticks" },
        { label: "Seconds", value: "seconds" },
        { label: "Minutes", value: "minutes" },
        { label: "Hours", value: "hours" },
        { label: "Days", value: "days" },
    ];

    it("returns all duration types when config is null", () => {
        const result = getAvailableDurationTypes(null, mockDurationTypes);
        expect(result).toEqual(mockDurationTypes);
    });

    it("filters duration types based on supported units and ranges", () => {
        const mockConfig = {
            data: {
                defaults: {
                    id: "CALL",
                    duration: 1,
                    duration_unit: "ticks",
                    allow_equals: true,
                    stake: 10,
                },
                validations: {
                    durations: {
                        supported_units: ["ticks", "seconds"],
                        ticks: { min: 1, max: 10 },
                        seconds: { min: 15, max: 3600 }, // 1 hour in seconds
                    },
                    stake: { min: "0.35", max: "100000" },
                    payout: { min: "0", max: "100000" },
                },
            },
        } as ProductConfigResponse;

        const result = getAvailableDurationTypes(mockConfig, mockDurationTypes);

        // Should include:
        // - ticks (directly supported)
        // - seconds (directly supported, 15-59s)
        // - minutes (derived from seconds, 1-59m)
        // - hours (derived from seconds, max 3600s = 1h)
        expect(result).toHaveLength(4); // ticks, seconds, minutes, hours
        const values = result.map((t) => t.value);
        expect(values).toContain("ticks");
        expect(values).toContain("seconds");
        expect(values).toContain("minutes");
        expect(values).toContain("hours");
        expect(values).not.toContain("days");
    });

    it("handles empty supported units", () => {
        const mockConfig = {
            data: {
                defaults: {
                    id: "CALL",
                    duration: 1,
                    duration_unit: "ticks",
                    allow_equals: true,
                    stake: 10,
                },
                validations: {
                    durations: {
                        supported_units: [],
                    },
                    stake: { min: "0.35", max: "100000" },
                    payout: { min: "0", max: "100000" },
                },
            },
        } as ProductConfigResponse;

        const result = getAvailableDurationTypes(mockConfig, mockDurationTypes);
        expect(result).toHaveLength(0);
    });

    it("handles time-based types when seconds are supported", () => {
        const mockConfig = {
            data: {
                defaults: {
                    id: "CALL",
                    duration: 15,
                    duration_unit: "seconds",
                    allow_equals: true,
                    stake: 10,
                },
                validations: {
                    durations: {
                        supported_units: ["seconds"],
                        seconds: { min: 15, max: 3600 }, // 1 hour in seconds
                    },
                    stake: { min: "0.35", max: "100000" },
                    payout: { min: "0", max: "100000" },
                },
            },
        } as ProductConfigResponse;

        const result = getAvailableDurationTypes(mockConfig, mockDurationTypes);

        // Should include:
        // - seconds (directly supported, 15-59s)
        // - minutes (derived from seconds, 1-59m)
        // - hours (derived from seconds, max 3600s = 1h)
        expect(result).toHaveLength(3); // seconds, minutes, hours
        const values = result.map((t) => t.value);
        expect(values).toContain("seconds");
        expect(values).toContain("minutes");
        expect(values).toContain("hours");
        expect(values).not.toContain("ticks");
        expect(values).not.toContain("days");
    });
});

describe("convertSecondsToDurationRanges", () => {
    it("converts seconds to appropriate duration ranges", () => {
        const result = convertSecondsToDurationRanges(15, 3600);

        expect(result.seconds).toEqual({ min: 15, max: 59 });
        expect(result.minutes).toEqual({ min: 1, max: 59 });
        expect(result.hours).toEqual({ min: 1, max: 1, step: 1 });
    });

    it("handles seconds only", () => {
        const result = convertSecondsToDurationRanges(15, 45);

        expect(result.seconds).toEqual({ min: 15, max: 45 });
        expect(result.minutes).toBeUndefined();
        expect(result.hours).toBeUndefined();
    });

    it("handles minutes without hours", () => {
        const result = convertSecondsToDurationRanges(60, 1800);

        expect(result.seconds).toBeUndefined();
        expect(result.minutes).toEqual({ min: 1, max: 30 });
        expect(result.hours).toBeUndefined();
    });
});

describe("adaptDurationRanges", () => {
    it("adapts duration ranges from API config", () => {
        const mockConfig = {
            data: {
                defaults: {
                    id: "CALL",
                    duration: 1,
                    duration_unit: "ticks",
                    allow_equals: true,
                    stake: 10,
                },
                validations: {
                    durations: {
                        supported_units: ["ticks", "seconds"],
                        ticks: { min: 1, max: 10 },
                        seconds: { min: 15, max: 3600 },
                    },
                    stake: { min: "0.35", max: "100000" },
                    payout: { min: "0", max: "100000" },
                },
            },
        } as ProductConfigResponse;

        const result = adaptDurationRanges(mockConfig);

        expect(result.ticks).toEqual({ min: 1, max: 10 });
        expect(result.seconds).toEqual({ min: 15, max: 59 });
        expect(result.minutes).toEqual({ min: 1, max: 59 });
        expect(result.hours).toEqual({ min: 1, max: 1, step: 1 });
    });

    it("uses ticks as fallback when no valid ranges", () => {
        const mockConfig = {
            data: {
                defaults: {
                    id: "CALL",
                    duration: 1,
                    duration_unit: "ticks",
                    allow_equals: true,
                    stake: 10,
                },
                validations: {
                    durations: {
                        supported_units: [],
                    },
                    stake: { min: "0.35", max: "100000" },
                    payout: { min: "0", max: "100000" },
                },
            },
        } as ProductConfigResponse;

        const result = adaptDurationRanges(mockConfig);

        expect(result.ticks).toEqual({ min: 1, max: 10 });
        expect(Object.keys(result)).toHaveLength(1);
    });
});
