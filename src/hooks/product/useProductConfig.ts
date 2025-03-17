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

interface ProductConfigParams {
    product_id: string;
    instrument_id: string;
    account_uuid?: string | null;
}

export const useProductConfig = () => {
    const {
        setProductConfig,
        setConfigLoading,
        setConfigError,
        setDuration,
        setStake,
        allowEquals,
        setAllowEquals,
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
                setAllowEquals(config.data.defaults.allow_equals);
            }
        },
        [setDuration, setStake, allowEquals]
    );

    // Handle successful product config fetch
    const handleConfigSuccess = useCallback(
        (config: ProductConfigResponse, product_id: string, instrument_id: string) => {
            setProductConfig(config);
            setConfigLoading(false);

            // Create a cache key
            const cacheKey = `${product_id}_${instrument_id}`;
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
            // applyFallbackConfig();
        },
        [setConfigError, setConfigLoading, toast]
    );

    // Use mutation hook for product config
    const { mutate, loading, error } = useMutation<ProductConfigResponse, ProductConfigParams>({
        mutationFn: getProductConfig,
        onSuccess: () => {
            // We'll handle this in fetchProductConfig to avoid dependency issues
        },
        onError: handleConfigError,
    });

    // Fetch product configuration
    const fetchProductConfig = useCallback(
        async (product_id: string, instrument_id: string, account_uuid?: string | null) => {
            setConfigLoading(true);
            setConfigError(null);

            // Create a cache key
            const cacheKey = `${product_id}_${instrument_id}`;

            // Check if we have a cached response
            if (configCache[cacheKey]) {
                const cachedConfig = configCache[cacheKey];
                handleConfigSuccess(cachedConfig, product_id, instrument_id);
                return;
            }

            try {
                // Call the mutation function with updated parameter names
                const result = await mutate({ product_id, instrument_id, account_uuid });
                if (result) {
                    handleConfigSuccess(result, product_id, instrument_id);
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
        loading,
        error,
    };
};
