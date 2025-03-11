export interface ProductConfigDefaults {
    id: string;
    duration: number;
    duration_units: string;
    allow_equals: boolean;
    stake: number;
}

export interface DurationValidation {
    min: number;
    max: number;
}

export interface DurationValidations {
    supported_units: string[];
    ticks?: DurationValidation;
    seconds?: DurationValidation;
    days?: DurationValidation;
}

export interface StakeValidation {
    min: string;
    max: string;
}

export interface PayoutValidation {
    min: string;
    max: string;
}

export interface ProductConfigValidations {
    durations: DurationValidations;
    stake: StakeValidation;
    payout: PayoutValidation;
}

export interface ProductConfigResponse {
    data: {
        defaults: ProductConfigDefaults;
        validations: ProductConfigValidations;
    };
}

export interface ProductConfigRequest {
    product_type: string;
    instrument_id: string;
}
