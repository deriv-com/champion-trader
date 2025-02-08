import React from "react";
import { StakeInput } from "./StakeInput";
import { PayoutDisplay } from "./PayoutDisplay";
import { STAKE_CONFIG } from "@/config/stake";
import { useClientStore } from "@/stores/clientStore";

interface StakeFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: boolean;
  errorMessage?: string;
  maxPayout: number;
  isDesktop?: boolean;
}

export const StakeField: React.FC<StakeFieldProps> = ({
  value,
  onChange,
  onBlur,
  error,
  errorMessage,
  maxPayout,
  isDesktop,
}) => {
  const { currency } = useClientStore();
  const amount = value ? parseFloat(value.split(" ")[0]) : 0;
  const hasError = Boolean(error && amount > maxPayout);

  return (
    <div className="flex flex-col h-full justify-between">
      <StakeInput
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        isDesktop={isDesktop}
        error={error}
        errorMessage={errorMessage}
        maxPayout={maxPayout}
      />
      <div className="mt-4">
        <PayoutDisplay hasError={hasError} />
      </div>
    </div>
  );
};
