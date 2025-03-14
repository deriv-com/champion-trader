import { useCallback, useEffect, useRef } from "react";
import { useQuery } from "@/api/hooks";
import { useTradeStore } from "@/stores/tradeStore";
import { useClientStore } from "@/stores/clientStore";
import { useToastStore } from "@/stores/toastStore";
import { getProductConfig } from "@/api/services/product/product-rest";
import { ProductConfigResponse, ProductConfigRequest } from "@/api/services/product/types";
import { updateDurationRanges } from "@/utils/duration";
import { adaptDefaultDuration } from "@/adapters/duration-config-adapter";
import {
    adaptStakeConfig,
    updateStakeConfig,
    adaptDefaultStake,
} from "@/adapters/stake-config-adapter";

export const useProductConfig = () => {
    const {
        trade_type,
        instrument,
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
    const { account_uuid } = useClientStore();
    const { toast } = useToastStore();

    // Create a cache key
    const cacheKey = `${trade_type}_${instrument}`;

    // Check if we have a cached response
    const cachedConfig = configCache[cacheKey];

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

            setAllowEquals(config.data.defaults.allow_equals);
        },
        [setDuration, setStake, allowEquals]
    );

    // Handle successful product config fetch
    const handleSuccess = useCallback(
        (config: ProductConfigResponse, skipCacheUpdate = false) => {
            setProductConfig(config);
            // Only update the cache if we're not applying a cached config
            if (!skipCacheUpdate) {
                setConfigCache({ ...configCache, [cacheKey]: config });
            }
            applyConfig(config);
        },
        [applyConfig, cacheKey, configCache, setConfigCache, setProductConfig]
    );

    // Use query hook for product config
    const { data, error, loading, refetch } = useQuery<ProductConfigResponse, ProductConfigRequest>(
        {
            queryFn: getProductConfig,
            params: {
                product_id: trade_type,
                instrument_id: instrument,
                ...(account_uuid ? { account_uuid } : {}),
            },
            enabled: !cachedConfig, // Only fetch if not in cache
            onSuccess: (data) => handleSuccess(data, false), // Update cache for new API data
            onError: (error) => {
                setConfigError(error);
                toast({
                    content: `Failed to load trade configuration: ${error.message}`,
                    variant: "error",
                    duration: 5000,
                });
            },
        }
    );

    // Add a ref to track if we've applied the cached config
    const appliedCacheRef = useRef<Record<string, boolean>>({});

    // Reset the applied cache ref when trade_type or instrument changes
    useEffect(() => {
        // Reset the applied cache flag for this specific cache key
        // This allows us to apply the cached config again if the trade_type or instrument changes
        // and then changes back to a previously used value
        appliedCacheRef.current = {};
    }, [trade_type, instrument]);

    // Apply cached config if available (only once per cache key)
    useEffect(() => {
        if (cachedConfig && !appliedCacheRef.current[cacheKey]) {
            appliedCacheRef.current[cacheKey] = true;
            handleSuccess(cachedConfig, true); // Skip cache update when applying cached config
        }
    }, [cacheKey, cachedConfig, handleSuccess]);

    // Update loading state
    useEffect(() => {
        setConfigLoading(loading);
    }, [loading, setConfigLoading]);

    // Reset product configuration
    const resetProductConfig = useCallback(() => {
        setProductConfig(null);
        setConfigLoading(false);
        setConfigError(null);
    }, [setConfigError, setConfigLoading, setProductConfig]);

    return {
        data: data || cachedConfig,
        error,
        loading,
        refetch,
        resetProductConfig,
    };
};
