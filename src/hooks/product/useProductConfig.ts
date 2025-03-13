import { useCallback } from "react";
import { useMutation } from "@/api/hooks";
import { useTradeStore } from "@/stores/tradeStore";
import { useToastStore } from "@/stores/toastStore";
import { getProductConfig } from "@/api/services/product/product-rest";
import { ProductConfigResponse } from "@/api/services/product/types";
import { updateDurationRanges } from "@/utils/duration";
import { adaptDefaultDuration } from "@/adapters/duration-config-adapter";
import {
    adaptStakeConfig,
    updateStakeConfig,
    adaptDefaultStake,
} from "@/adapters/stake-config-adapter";

// Default configuration to use as fallback
const DEFAULT_CONFIG: ProductConfigResponse = {
    data: {
        defaults: {
            id: "rise_fall",
            duration: 60,
            duration_unit: "seconds",
            allow_equals: true,
            stake: 10,
        },
        validations: {
            durations: {
                supported_units: ["ticks", "seconds", "days"],
                ticks: { min: 1, max: 10 },
                seconds: { min: 15, max: 86400 },
                days: { min: 1, max: 365 },
            },
            stake: {
                min: "1.00",
                max: "50000.00",
            },
            payout: {
                min: "1.00",
                max: "50000.00",
            },
        },
    },
};

interface ProductConfigParams {
    product_type: string;
    instrument_id: string;
}

export const useProductConfig = () => {
    const {
        setProductConfig,
        setConfigLoading,
        setConfigError,
        setDuration,
        setStake,
        allowEquals,
        toggleAllowEquals,
        configCache,
        setConfigCache,
    } = useTradeStore();
    const { toast } = useToastStore();

    // Apply configuration to the app
    const applyConfig = useCallback(
        (config: ProductConfigResponse) => {
            // Update duration ranges with the new config
            updateDurationRanges(config);

            // Set default duration in the correct format
            const defaultDuration = adaptDefaultDuration(config);
            setDuration(defaultDuration);

            // Update stake configuration using the adapter
            const stakeConfig = adaptStakeConfig(config);
            updateStakeConfig(stakeConfig);

            // Set default stake value
            const defaultStake = adaptDefaultStake(config);
            setStake(defaultStake);

            // Set allow equals if different from current value
            if (allowEquals !== config.data.defaults.allow_equals) {
                toggleAllowEquals();
            }
        },
        [setDuration, setStake, allowEquals, toggleAllowEquals]
    );

    // Apply fallback configuration
    const applyFallbackConfig = useCallback(() => {
        console.warn("Using fallback product configuration");
        setProductConfig(DEFAULT_CONFIG);
        setConfigLoading(false);
        applyConfig(DEFAULT_CONFIG);
    }, [applyConfig, setConfigLoading, setProductConfig]);

    // Handle successful product config fetch
    const handleConfigSuccess = useCallback(
        (config: ProductConfigResponse, product_type: string, instrument_id: string) => {
            setProductConfig(config);
            setConfigLoading(false);

            // Create a cache key
            const cacheKey = `${product_type}_${instrument_id}`;
            setConfigCache({ ...configCache, [cacheKey]: config });

            // Apply the configuration
            applyConfig(config);
        },
        [applyConfig, configCache, setConfigCache, setConfigLoading, setProductConfig]
    );

    // Handle error in product config fetch
    const handleConfigError = useCallback(
        (error: Error) => {
            setConfigError(error);
            setConfigLoading(false);

            // Show error toast
            toast({
                content: `Failed to load trade configuration: ${error.message}`,
                variant: "error",
                duration: 5000,
            });

            // Apply fallback config
            applyFallbackConfig();
        },
        [applyFallbackConfig, setConfigError, setConfigLoading, toast]
    );

    // Use mutation hook for product config
    const { mutate, loading, error } = useMutation<ProductConfigResponse, ProductConfigParams>({
        mutationFn: getProductConfig,
        onSuccess: (config) => {
            // We'll handle this in fetchProductConfig to avoid dependency issues
        },
        onError: handleConfigError,
    });

    // Fetch product configuration
    const fetchProductConfig = useCallback(
        async (product_type: string, instrument_id: string) => {
            setConfigLoading(true);
            setConfigError(null);

            // Create a cache key
            const cacheKey = `${product_type}_${instrument_id}`;

            // Check if we have a cached response
            if (configCache[cacheKey]) {
                const cachedConfig = configCache[cacheKey];
                handleConfigSuccess(cachedConfig, product_type, instrument_id);
                return;
            }

            try {
                // Call the mutation function
                const result = await mutate({ product_type, instrument_id });
                if (result) {
                    handleConfigSuccess(result, product_type, instrument_id);
                }
            } catch (error) {
                // Error is handled by onError callback
            }
        },
        [configCache, handleConfigSuccess, mutate, setConfigError, setConfigLoading]
    );

    // Reset product configuration
    const resetProductConfig = useCallback(() => {
        setProductConfig(null);
        setConfigLoading(false);
        setConfigError(null);
    }, [setConfigError, setConfigLoading, setProductConfig]);

    return {
        fetchProductConfig,
        resetProductConfig,
        applyFallbackConfig,
        loading,
        error,
    };
};
