import { useCallback } from "react";
import { useTradeStore } from "@/stores/tradeStore";
import { useToastStore } from "@/stores/toastStore";
import { getProductConfig } from "@/services/api/rest/product-config/service";
import { ProductConfigResponse } from "@/services/api/rest/product-config/types";
import { updateDurationRanges } from "@/utils/duration";
import { adaptDefaultDuration } from "@/utils/duration-config-adapter";
import { STAKE_CONFIG } from "@/config/stake";

// Default configuration to use as fallback
const DEFAULT_CONFIG: ProductConfigResponse = {
  data: {
    defaults: {
      id: "rise_fall",
      duration: 60,
      duration_units: "seconds",
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

      // Update stake configuration and set default value
      const { stake: stakeValidation } = config.data.validations;
      const currentStep = STAKE_CONFIG.step; // Preserve step value
      Object.assign(STAKE_CONFIG, {
        min: parseFloat(stakeValidation.min),
        max: parseFloat(stakeValidation.max),
        step: currentStep,
      });
      setStake(config.data.defaults.stake.toString());
      setAllowEquals(config.data.defaults.allow_equals);
    },
    [setDuration, setStake, setAllowEquals]
  );

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
        setProductConfig(cachedConfig);
        setConfigLoading(false);
        applyConfig(cachedConfig);
        return;
      }

      try {
        const config = await getProductConfig({ product_type, instrument_id });

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
          content: `Failed to load trade configuration: ${
            (error as Error).message
          }`,
          variant: "error",
          duration: 5000,
        });

        // Apply fallback config
        applyFallbackConfig();
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

  // Apply fallback configuration
  const applyFallbackConfig = useCallback(() => {
    console.warn("Using fallback product configuration");
    setProductConfig(DEFAULT_CONFIG);
    setConfigLoading(false);
    applyConfig(DEFAULT_CONFIG);
  }, [applyConfig, setConfigLoading, setProductConfig]);

  return {
    fetchProductConfig,
    resetProductConfig,
    applyFallbackConfig,
  };
};
