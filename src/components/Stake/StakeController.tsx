import React from "react";
import { useTradeStore } from "@/stores/tradeStore";
import { useClientStore } from "@/stores/clientStore";
import { BottomSheetHeader } from "@/components/ui/bottom-sheet-header";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { useDebounce } from "@/hooks/useDebounce";
import { StakeField } from "./components/StakeField";
import { PrimaryButton } from "@/components/ui/primary-button";
import { parseStakeAmount, STAKE_CONFIG } from "@/config/stake";
import { DesktopTradeFieldCard } from "@/components/ui/desktop-trade-field-card";

interface StakeControllerProps {
  onClose?: () => void;
}

export const StakeController: React.FC<StakeControllerProps> = ({
  onClose,
}) => {
  const { stake, setStake, payouts } = useTradeStore();
  const { currency } = useClientStore();
  const { isDesktop } = useDeviceDetection();
  const { setBottomSheet } = useBottomSheetStore();

  // Initialize local state for both mobile and desktop
  const [localStake, setLocalStake] = React.useState(stake);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string>();

  // Use debounced updates for desktop
  useDebounce(
    localStake,
    (value) => {
      if (isDesktop) {
        const amount = value ? parseStakeAmount(value) : 0;
        
        // Check minimum stake first
        if (amount < STAKE_CONFIG.min) {
          setError(true);
          setErrorMessage(
            `Minimum stake is ${STAKE_CONFIG.min} ${currency}`
          );
          return;
        }

        // Then check maximum payout
        if (amount > payouts.max) {
          setError(true);
          setErrorMessage(
            `Minimum stake of ${STAKE_CONFIG.min} ${currency} and maximum payout of ${payouts.max} ${currency}. Current payout is ${amount} ${currency}.`
          );
          return;
        }

        // If all validations pass, update store
        setError(false);
        setErrorMessage(undefined);
        setStake(value);
      }
    },
    500
  );

  const handleStakeChange = (value: string) => {
    setLocalStake(value);
    const amount = value ? parseStakeAmount(value) : 0;

    // Only check max payout during typing
    if (amount > payouts.max) {
      setError(true);
      setErrorMessage(
        `Minimum stake of ${STAKE_CONFIG.min} and maximum payout of ${payouts.max}. Current payout is ${amount}.`
      );
    } else {
      setError(false);
      setErrorMessage(undefined);
    }
  };

  const handleSave = () => {
    const amount = localStake ? parseStakeAmount(localStake) : 0;

    // Check minimum stake first
    if (amount < STAKE_CONFIG.min) {
      setError(true);
      setErrorMessage(
        `Minimum stake is ${STAKE_CONFIG.min} ${currency}`
      );
      return; // Don't close if there's an error
    }

    // Then check maximum payout
    if (amount > payouts.max) {
      setError(true);
      setErrorMessage(
        `Minimum stake of ${STAKE_CONFIG.min} ${currency} and maximum payout of ${payouts.max} ${currency}. Current payout is ${amount} ${currency}.`
      );
      return; // Don't close if there's an error
    }

    setError(false);
    setErrorMessage(undefined);
    setStake(localStake);
    if (isDesktop) {
      onClose?.();
    } else {
      setBottomSheet(false);
    }
  };

  const content = (
    <>
      {!isDesktop && <BottomSheetHeader title="Stake" />}
      <div className="flex flex-col justify-between flex-grow px-6">
        <StakeField
          value={localStake}
          onChange={handleStakeChange}
          error={error}
          errorMessage={errorMessage}
          maxPayout={payouts.max}
          isDesktop={isDesktop}
        />
        {!isDesktop && (
          <div className="w-full p-6">
            <PrimaryButton onClick={handleSave}>Save</PrimaryButton>
          </div>
        )}
      </div>
    </>
  );

  if (isDesktop) {
    return (
      <DesktopTradeFieldCard>
        <div className="w-[480px]">{content}</div>
      </DesktopTradeFieldCard>
    );
  }

  return <div className="flex flex-col h-full">{content}</div>;
};
