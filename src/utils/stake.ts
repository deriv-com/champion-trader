import { getStakeConfig } from "@/adapters/stake-config-adapter";

export const parseStakeAmount = (stake: string): number => {
    // Handle both numeric strings and "amount currency" format
    return Number(stake.includes(" ") ? stake.split(" ")[0] : stake);
};

export const incrementStake = (currentStake: string): string => {
    const amount = parseStakeAmount(currentStake);
    const config = getStakeConfig();
    return String(Math.min(amount + config.step, config.max));
};

export const decrementStake = (currentStake: string): string => {
    const amount = parseStakeAmount(currentStake);
    const config = getStakeConfig();
    return String(Math.max(amount - config.step, config.min));
};
