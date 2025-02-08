import React, { useCallback, useRef, useEffect } from "react";
import { useTradeStore } from "@/stores/tradeStore";
import { useClientStore } from "@/stores/clientStore";
import { BottomSheetHeader } from "@/components/ui/bottom-sheet-header";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { useDebounce } from "@/hooks/useDebounce";
import { StakeInputLayout } from "./components/StakeInputLayout";
import { PrimaryButton } from "@/components/ui/primary-button";
import { parseStakeAmount, STAKE_CONFIG } from "@/config/stake";
import { DesktopTradeFieldCard } from "@/components/ui/desktop-trade-field-card";
import { useStakeSSE } from "./hooks/useStakeSSE";
import { validateStake } from "./utils/validation";
import { parseDuration } from "@/utils/duration";

interface StakeControllerProps {
  onClose?: () => void;
}

export const StakeController: React.FC<StakeControllerProps> = ({
  onClose,
}) => {
  const { stake, setStake, trade_type, duration } = useTradeStore();
  const { currency, token } = useClientStore();
  const { isDesktop } = useDeviceDetection();
  const { setBottomSheet } = useBottomSheetStore();

  const [localStake, setLocalStake] = React.useState(stake);
  const [debouncedStake, setDebouncedStake] = React.useState(stake);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string>();

  // Debounce stake updates for SSE connections
  useDebounce(localStake, setDebouncedStake, 500);

  // Parse duration for API call
  const { value: apiDurationValue, type: apiDurationType } = parseDuration(duration);

  // Use SSE hook for payout info
  const { loading, loadingStates, payouts: localPayouts } = useStakeSSE({
    duration: apiDurationValue,
    durationType: apiDurationType,
    trade_type,
    currency,
    stake: debouncedStake,
    token
  });

  const validateAndUpdateStake = (value: string) => {
    // Always validate empty field as error
    if (!value) {
      setError(true);
      setErrorMessage('Please enter an amount');
      return { error: true };
    }

    const amount = parseStakeAmount(value);
    const validation = validateStake({
      amount,
      minStake: STAKE_CONFIG.min,
      maxPayout: localPayouts.max,
      currency
    });

    setError(validation.error);
    setErrorMessage(validation.message);
    
    return validation;
  };

  // Desktop only - validate without updating store
  const validateStakeOnly = (value: string) => {
    if (!value) {
      setError(true);
      setErrorMessage('Please enter an amount');
      return { error: true };
    }

    const amount = parseStakeAmount(value);
    const validation = validateStake({
      amount,
      minStake: STAKE_CONFIG.min,
      maxPayout: localPayouts.max,
      currency
    });

    setError(validation.error);
    setErrorMessage(validation.message);
    return validation;
  };

  const preventExceedingMax = (value: string) => {
    if (error && errorMessage?.includes('maximum')) {
      const newAmount = value ? parseStakeAmount(value) : 0;
      const maxAmount = parseStakeAmount(localPayouts.max.toString());
      return newAmount > maxAmount;
    }
    return false;
  };

  const handleStakeChange = (value: string) => {
    // Shared logic - prevent exceeding max
    if (preventExceedingMax(value)) return;

    if (isDesktop) {
      // Desktop specific - validate only
      setLocalStake(value);
      validateStakeOnly(value);
      return;
    }

    // Mobile stays exactly as is
    setLocalStake(value);
    validateAndUpdateStake(value);
  };

  // Watch for conditions and update store in desktop mode
  useEffect(() => {
    if (!isDesktop) return;
    
    if (debouncedStake !== stake) {
      const validation = validateStakeOnly(debouncedStake);
      if (!validation.error && !loading) {
        setStake(debouncedStake);
      }
    }
  }, [isDesktop, debouncedStake, loading, stake]);

  const handleSave = () => {
    if (isDesktop) return; // Early return for desktop

    const validation = validateAndUpdateStake(localStake);
    if (validation.error) return;

    setStake(localStake);
    setBottomSheet(false);
  };

  const content = (
    <>
      {!isDesktop && <BottomSheetHeader title="Stake" />}
      <div className="flex flex-col justify-between flex-grow px-6">
      <StakeInputLayout
        value={localStake}
        onChange={handleStakeChange}
        error={error}
        errorMessage={errorMessage}
        maxPayout={localPayouts.max}
        payoutValues={localPayouts.values}
        isDesktop={isDesktop}
        loading={loading}
        loadingStates={loadingStates}
      />
        {!isDesktop && (
          <div className="w-full p-6">
            <PrimaryButton 
              onClick={handleSave}
              disabled={loading || error || debouncedStake === stake}
            >
              Save
            </PrimaryButton>
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
