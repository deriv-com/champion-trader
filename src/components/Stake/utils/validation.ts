interface ValidateStakeParams {
    amount: number;
    minStake: number;
    maxStake: number;
    currency: string;
}

interface ValidationResult {
    error: boolean;
    message?: string;
}

export const validateStake = ({
    amount,
    minStake,
    maxStake,
    currency,
}: ValidateStakeParams): ValidationResult => {
    if (amount < minStake) {
        return {
            error: true,
            message: `Minimum stake is ${minStake} ${currency}`,
        };
    }

    if (amount > maxStake) {
        return {
            error: true,
            message: `Minimum stake of ${minStake} ${currency} and maximum stake of ${maxStake} ${currency}. Current stake is ${amount} ${currency}.`,
        };
    }

    return { error: false };
};
