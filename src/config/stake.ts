interface StakeConfig {
    min: number;
    max: number;
    step: number;
}

export const STAKE_CONFIG: StakeConfig = {
    min: 1,
    max: 50000,
    step: 1,
};

export const parseStakeAmount = (stake: string): number => {
    // Handle both numeric strings and "amount currency" format
    return Number(stake.includes(" ") ? stake.split(" ")[0] : stake);
};

export const validateStakeAmount = (amount: number): boolean => {
    return amount >= STAKE_CONFIG.min && amount <= STAKE_CONFIG.max;
};

export const incrementStake = (currentStake: string): string => {
    const amount = parseStakeAmount(currentStake);
    return String(Math.min(amount + STAKE_CONFIG.step, STAKE_CONFIG.max));
};

export const decrementStake = (currentStake: string): string => {
    const amount = parseStakeAmount(currentStake);
    return String(Math.max(amount - STAKE_CONFIG.step, STAKE_CONFIG.min));
};
