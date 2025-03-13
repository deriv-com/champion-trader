/**
 * Duration range with min and max values
 */
export interface DurationRange {
    min: number;
    max: number;
    step?: number;
}

/**
 * Duration ranges for different duration types
 */
export interface DurationRangesResponse {
    ticks: DurationRange;
    seconds: DurationRange;
    minutes: DurationRange;
    hours: DurationRange;
    days: DurationRange;
}

/**
 * Response from products API
 */
export interface ProductsResponse {
    data: {
        products: Array<{
            id: string;
            display_name: string;
        }>;
    };
}

/**
 * Product configuration defaults
 */
export interface ProductConfigDefaults {
    id: string;
    duration: number;
    duration_unit: string;
    allow_equals: boolean;
    stake: number;
}

/**
 * Duration validation
 */
export interface DurationValidation {
    min: number;
    max: number;
}

/**
 * Duration validations
 */
export interface DurationValidations {
    supported_units: string[];
    ticks?: DurationValidation;
    seconds?: DurationValidation;
    days?: DurationValidation;
}

/**
 * Stake validation
 */
export interface StakeValidation {
    min: string;
    max: string;
}

/**
 * Payout validation
 */
export interface PayoutValidation {
    min: string;
    max: string;
}

/**
 * Product configuration validations
 */
export interface ProductConfigValidations {
    durations: DurationValidations;
    stake: StakeValidation;
    payout: PayoutValidation;
}

/**
 * Response from product configuration API
 */
export interface ProductConfigResponse {
    data: {
        defaults: ProductConfigDefaults;
        validations: ProductConfigValidations;
    };
}

/**
 * Request for product configuration API
 */
export interface ProductConfigRequest {
    product_type: string;
    instrument_id: string;
}
