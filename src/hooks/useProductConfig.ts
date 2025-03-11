import { useCallback } from "react";
import { useTradeStore } from "@/stores/tradeStore";
import { useToastStore } from "@/stores/toastStore";
import { getProductConfig } from "@/services/api/rest/product-config/service";
import { ProductConfigResponse } from "@/services/api/rest/product-config/types";
import { updateDurationRanges } from "@/utils/duration";
import { adaptDefaultDuration } from "@/adapters/duration-config-adapter";
import {
    adaptStakeConfig,
    updateStakeConfig,
    adaptDefaultStake,
} from "@/adapters/stake-config-adapter";

export const useProductConfig = () => {
    const {
        setProductConfig,
        setConfigLoading,
        setConfigError,
        setDuration,
        setStake,
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
            setAllowEquals(config.data.defaults.allow_equals);
        },
        [setDuration, setStake, setAllowEquals]
    );

    // Fetch product configuration
    const fetchProductConfig = useCallback(
        async (product_id: string, instrument_id: string) => {
            setConfigLoading(true);
            setConfigError(null);

            // Create a cache key
            const cacheKey = `${product_id}_${instrument_id}`;

            // Check if we have a cached response
            if (configCache[cacheKey]) {
                const cachedConfig = configCache[cacheKey];
                setProductConfig(cachedConfig);
                setConfigLoading(false);
                applyConfig(cachedConfig);
                return;
            }

            try {
                const config = await getProductConfig({
                    instrument_id,
                    product_id,
                    account_uuid: "", // TODO - get the actual account_uuid
                });

                // Update cache
                setProductConfig(config);
                setConfigLoading(false);
                setConfigCache({ ...configCache, [cacheKey]: config });

                // Apply the configuration
                applyConfig(config);
            } catch (error) {
                setConfigError(error as Error);
                setConfigLoading(false);

                // Show error toast
                toast({
                    content: `Failed to load trade configuration: ${(error as Error).message}`,
                    variant: "error",
                    duration: 5000,
                });
            }
        },
        [
            applyConfig,
            configCache,
            setConfigCache,
            setConfigError,
            setConfigLoading,
            setProductConfig,
            toast,
        ]
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
    };
};
