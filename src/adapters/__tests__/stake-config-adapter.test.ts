import {
    adaptStakeConfig,
    updateStakeConfig,
    getStakeConfig,
    adaptDefaultStake,
} from "../stake-config-adapter";
import type { ProductConfigResponse } from "@/api/services/product/types";

describe("adaptStakeConfig", () => {
    it("adapts stake configuration from API response", () => {
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
                    stake: { min: "5.00", max: "2500.00" },
                    payout: { min: "0", max: "100000" },
                },
            },
        } as ProductConfigResponse;

        const result = adaptStakeConfig(mockConfig);

        expect(result.min).toEqual(5);
        expect(result.max).toEqual(2500);
        expect(result.step).toEqual(1); // Preserved from default
    });
});

describe("updateStakeConfig and getStakeConfig", () => {
    it("updates and retrieves stake configuration", () => {
        const newConfig = {
            min: 10,
            max: 1000,
            step: 5,
        };

        updateStakeConfig(newConfig);
        const result = getStakeConfig();

        expect(result).toEqual(newConfig);
        expect(result).not.toBe(newConfig); // Should be a copy, not the same reference
    });

    it("preserves step value when updating", () => {
        const initialConfig = {
            min: 1,
            max: 100,
            step: 2,
        };

        updateStakeConfig(initialConfig);

        const mockConfig = {
            data: {
                defaults: {
                    stake: 10,
                },
                validations: {
                    stake: { min: "5.00", max: "50.00" },
                },
            },
        } as ProductConfigResponse;

        const result = adaptStakeConfig(mockConfig);

        expect(result.min).toEqual(5);
        expect(result.max).toEqual(50);
        expect(result.step).toEqual(2); // Should preserve step from previous config
    });
});

describe("adaptDefaultStake", () => {
    it("gets default stake value from product config", () => {
        const mockConfig = {
            data: {
                defaults: {
                    stake: 25,
                },
            },
        } as ProductConfigResponse;

        const result = adaptDefaultStake(mockConfig);
        expect(result).toEqual("25");
    });

    it("handles decimal stake values", () => {
        const mockConfig = {
            data: {
                defaults: {
                    stake: 10.5,
                },
            },
        } as ProductConfigResponse;

        const result = adaptDefaultStake(mockConfig);
        expect(result).toEqual("10.5");
    });
});
