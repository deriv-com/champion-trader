import { renderHook, act } from "@testing-library/react-hooks";
import { useProductConfig } from "../useProductConfig";
import { getProductConfig } from "@/services/api/rest/product-config/service";
import { useTradeStore } from "@/stores/tradeStore";
import { useToastStore } from "@/stores/toastStore";

// Mock dependencies
jest.mock("@/services/api/rest/product-config/service");
jest.mock("@/stores/tradeStore");
jest.mock("@/stores/toastStore");

describe("useProductConfig", () => {
    const mockSetProductConfig = jest.fn();
    const mockSetConfigLoading = jest.fn();
    const mockSetConfigError = jest.fn();
    const mockSetConfigCache = jest.fn();
    const mockSetDuration = jest.fn();
    const mockSetStake = jest.fn();
    const mockSetAllowEquals = jest.fn();
    const mockToast = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useTradeStore as jest.MockedFunction<any>).mockReturnValue({
            setProductConfig: mockSetProductConfig,
            setConfigLoading: mockSetConfigLoading,
            setConfigError: mockSetConfigError,
            configCache: {},
            setConfigCache: mockSetConfigCache,
            setDuration: mockSetDuration,
            setStake: mockSetStake,
            setAllowEquals: mockSetAllowEquals,
        });

        (useToastStore as jest.MockedFunction<any>).mockReturnValue({
            toast: mockToast,
        });
    });

    it("should handle successful API response", async () => {
        const mockConfig = {
            data: {
                defaults: {
                    duration: 5,
                    duration_unit: "minutes",
                    stake: 10,
                    allow_equals: true,
                },
                validations: {
                    durations: {
                        supported_units: ["seconds", "minutes"],
                        seconds: { min: 15, max: 3600 },
                    },
                    stake: {
                        min: "1",
                        max: "50000",
                    },
                },
            },
        };

        (getProductConfig as jest.Mock).mockResolvedValue(mockConfig);

        const { result } = renderHook(() => useProductConfig());

        await act(async () => {
            await result.current.fetchProductConfig("rise_fall", "R_100");
        });

        // Should set loading states correctly
        expect(mockSetConfigLoading).toHaveBeenCalledWith(true);
        expect(mockSetConfigLoading).toHaveBeenLastCalledWith(false);

        // Should update product config
        expect(mockSetProductConfig).toHaveBeenCalledWith(mockConfig);

        // Should update cache
        expect(mockSetConfigCache).toHaveBeenCalledWith({
            rise_fall_R_100: mockConfig,
        });

        // Should reset error state
        expect(mockSetConfigError).toHaveBeenCalledWith(null);

        // Should not show error toast
        expect(mockToast).not.toHaveBeenCalled();

        // Should apply config
        expect(mockSetDuration).toHaveBeenCalled();
        expect(mockSetStake).toHaveBeenCalled();
        expect(mockSetAllowEquals).toHaveBeenCalledWith(true);
    });

    it("should use cached config when available", async () => {
        const mockCachedConfig = {
            data: {
                defaults: {
                    duration: 1,
                    duration_unit: "minutes",
                    stake: 100,
                    allow_equals: false,
                },
                validations: {
                    durations: {
                        supported_units: ["minutes"],
                        minutes: { min: 1, max: 60 },
                    },
                    stake: {
                        min: "1",
                        max: "1000",
                    },
                },
            },
        };

        (useTradeStore as jest.MockedFunction<any>).mockReturnValue({
            setProductConfig: mockSetProductConfig,
            setConfigLoading: mockSetConfigLoading,
            setConfigError: mockSetConfigError,
            configCache: {
                rise_fall_R_100: mockCachedConfig,
            },
            setConfigCache: mockSetConfigCache,
            setDuration: mockSetDuration,
            setStake: mockSetStake,
            setAllowEquals: mockSetAllowEquals,
        });

        const { result } = renderHook(() => useProductConfig());

        await act(async () => {
            await result.current.fetchProductConfig("rise_fall", "R_100");
        });

        // Should set loading states
        expect(mockSetConfigLoading).toHaveBeenCalledWith(true);
        expect(mockSetConfigLoading).toHaveBeenLastCalledWith(false);

        // Should use cached config
        expect(mockSetProductConfig).toHaveBeenCalledWith(mockCachedConfig);

        // Should not call API
        expect(getProductConfig).not.toHaveBeenCalled();

        // Should apply cached config
        expect(mockSetDuration).toHaveBeenCalled();
        expect(mockSetStake).toHaveBeenCalled();
        expect(mockSetAllowEquals).toHaveBeenCalledWith(false);
    });

    it("should handle API errors correctly", async () => {
        const mockError = new Error("API Error");
        (getProductConfig as jest.Mock).mockRejectedValue(mockError);

        const { result } = renderHook(() => useProductConfig());

        await act(async () => {
            await result.current.fetchProductConfig("rise_fall", "R_100");
        });

        // Should set loading states correctly
        expect(mockSetConfigLoading).toHaveBeenCalledWith(true);
        expect(mockSetConfigLoading).toHaveBeenLastCalledWith(false);

        // Should set error state
        expect(mockSetConfigError).toHaveBeenCalledWith(mockError);

        // Should not set product config
        expect(mockSetProductConfig).not.toHaveBeenCalled();

        // Should show error toast
        expect(mockToast).toHaveBeenCalledWith({
            content: "Failed to load trade configuration: API Error",
            variant: "error",
            duration: 5000,
        });
    });

    it("should reset product configuration", () => {
        const { result } = renderHook(() => useProductConfig());

        act(() => {
            result.current.resetProductConfig();
        });

        expect(mockSetProductConfig).toHaveBeenCalledWith(null);
        expect(mockSetConfigLoading).toHaveBeenCalledWith(false);
        expect(mockSetConfigError).toHaveBeenCalledWith(null);
    });
});
