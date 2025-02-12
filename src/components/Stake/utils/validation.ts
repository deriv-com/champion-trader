interface ValidateStakeParams {
  amount: number;
  minStake: number;
  maxPayout: number;
  currency: string;
}

interface ValidationResult {
  error: boolean;
  message?: string;
}

export const validateStake = ({
  amount,
  minStake,
  maxPayout,
  currency
}: ValidateStakeParams): ValidationResult => {
  if (amount < minStake) {
    return {
      error: true,
      message: `Minimum stake is ${minStake} ${currency}`
    };
  }

  if (amount > maxPayout) {
    return {
      error: true,
      message: `Minimum stake of ${minStake} ${currency} and maximum payout of ${maxPayout} ${currency}. Current payout is ${amount} ${currency}.`
    };
  }

  return { error: false };
};
