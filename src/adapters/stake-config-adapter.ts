import { ProductConfigResponse } from "@/api/services/product/types";

export interface StakeConfig {
    min: number;
    max: number;
    step: number;
}

// Default stake configuration
let STAKE_CONFIG: StakeConfig = {
    min: 1,
    max: 50000,
    step: 1,
};

/**
 * Adapts stake configuration from API response
 *
 * @param config - Product configuration from API
 * @returns Adapted stake configuration
 */
export const adaptStakeConfig = (config: ProductConfigResponse): StakeConfig => {
    const { stake: stakeValidation } = config.data.validations;

    return {
        min: parseFloat(stakeValidation.min),
        max: parseFloat(stakeValidation.max),
        step: STAKE_CONFIG.step, // Preserve step value
    };
};

/**
 * Updates stake configuration
 *
 * @param config - New stake configuration
 */
export const updateStakeConfig = (config: StakeConfig): void => {
    Object.assign(STAKE_CONFIG, config);
};

/**
 * Gets current stake configuration
 *
 * @returns Current stake configuration (copy to prevent mutations)
 */
export const getStakeConfig = (): StakeConfig => {
    return { ...STAKE_CONFIG };
};

/**
 * Gets default stake value from product config
 *
 * @param config - Product configuration from API
 * @returns Default stake value as string
 */
export const adaptDefaultStake = (config: ProductConfigResponse): string => {
    return config.data.defaults.stake.toString();
};
