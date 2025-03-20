import React, { useEffect, useState } from "react";
import { useTradeStore } from "@/stores/tradeStore";
import { useClientStore } from "@/stores/clientStore";
import { BottomSheetHeader } from "@/components/ui/bottom-sheet-header";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { useDebounce } from "@/hooks/useDebounce";
import { StakeInputLayout } from "./components/StakeInputLayout";
import { PrimaryButton } from "@/components/ui/primary-button";
import { parseStakeAmount } from "@/utils/stake";
import { getStakeConfig } from "@/adapters/stake-config-adapter";
import { validateStake } from "./utils/validation";
import { parseDuration, formatDuration } from "@/utils/duration";
import { createSSEConnection } from "@/api/base/sse";
import { tradeTypeConfigs } from "@/config/tradeTypes";
import { useOrientationStore } from "@/stores/orientationStore";

interface ButtonState {
    loading: boolean;
    error: Event | null;
    payout: number;
    reconnecting?: boolean;
}

type ButtonStates = Record<string, ButtonState>;

interface StakeControllerProps {}

export const StakeController: React.FC<StakeControllerProps> = () => {
    const {
        stake,
        setStake,
        trade_type,
        duration,
        payouts,
        setPayouts,
        productConfig: config,
    } = useTradeStore();
    const { currency, token } = useClientStore();
    const { isLandscape } = useOrientationStore();
    const { setBottomSheet } = useBottomSheetStore();

    const [localStake, setLocalStake] = React.useState(stake);
    const [debouncedStake, setDebouncedStake] = React.useState(stake);
    const [error, setError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string>();
    const [buttonStates, setButtonStates] = useState<ButtonStates>(() => {
        const initialStates: ButtonStates = {};
        tradeTypeConfigs[trade_type].buttons.forEach((button) => {
            initialStates[button.actionName] = {
                loading: false, // Set to false since we're using payouts from tradeStore
                error: null,
                payout: 0,
                reconnecting: false,
            };
        });
        return initialStates;
    });

    // Parse duration for API call
    const { value: apiDurationValue, type: apiDurationType } = parseDuration(duration);

    // Debounce stake updates
    useDebounce(localStake, setDebouncedStake, 500);

    useEffect(() => {
        // Only create SSE connections if productConfig exists
        if (!config) return;

        // Create SSE connections for each button's contract type
        const cleanupFunctions = tradeTypeConfigs[trade_type].buttons.map((button) => {
            return createSSEConnection({
                params: {
                    action: "contract_price",
                    duration: formatDuration(Number(apiDurationValue), apiDurationType),
                    trade_type: button.contractType,
                    instrument: "R_100",
                    currency: currency,
                    payout: stake,
                    strike: stake,
                },
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                onMessage: (priceData) => {
                    // Update button state for this specific button
                    setButtonStates((prev) => ({
                        ...prev,
                        [button.actionName]: {
                            loading: false,
                            error: null,
                            payout: Number(priceData.price),
                            reconnecting: false,
                        },
                    }));

                    // Update payouts in store
                    const payoutValue = Number(priceData.price);

                    // Create a map of button action names to their payout values
                    const payoutValues = Object.keys(buttonStates).reduce(
                        (acc, key) => {
                            acc[key] =
                                key === button.actionName
                                    ? payoutValue
                                    : buttonStates[key]?.payout || 0;
                            return acc;
                        },
                        {} as Record<string, number>
                    );

                    setPayouts({
                        max: 50000,
                        values: payoutValues,
                    });
                },
                onError: (error) => {
                    setButtonStates((prev) => ({
                        ...prev,
                        [button.actionName]: {
                            ...prev[button.actionName],
                            loading: false,
                            error,
                            reconnecting: true,
                        },
                    }));
                },
                onOpen: () => {
                    setButtonStates((prev) => ({
                        ...prev,
                        [button.actionName]: {
                            ...prev[button.actionName],
                            error: null,
                            reconnecting: false,
                        },
                    }));
                },
            });
        });

        return () => {
            cleanupFunctions.forEach((cleanup) => cleanup());
        };
    }, [duration, stake, currency, token, config]);

    const validateAndUpdateStake = (value: string) => {
        if (!value) {
            setError(true);
            setErrorMessage("Please enter an amount");
            return { error: true };
        }

        const amount = parseStakeAmount(value);
        const minStake = config?.data.validations.stake
            ? parseFloat(config.data.validations.stake.min)
            : getStakeConfig().min;
        const maxStake = config?.data.validations.stake
            ? parseFloat(config.data.validations.stake.max)
            : payouts.max;

        const validation = validateStake({
            amount,
            minStake,
            maxStake,
            currency,
        });

        setError(validation.error);
        setErrorMessage(validation.message);

        return validation;
    };

    const validateStakeOnly = (value: string) => {
        if (!value) {
            setError(true);
            setErrorMessage("Please enter an amount");
            return { error: true };
        }

        const amount = parseStakeAmount(value);
        const minStake = config?.data.validations.stake
            ? parseFloat(config.data.validations.stake.min)
            : getStakeConfig().min;
        const maxStake = config?.data.validations.stake
            ? parseFloat(config.data.validations.stake.max)
            : payouts.max;

        const validation = validateStake({
            amount,
            minStake,
            maxStake,
            currency,
        });

        setError(validation.error);
        setErrorMessage(validation.message);
        return validation;
    };

    const preventExceedingMax = (value: string) => {
        if (error && errorMessage?.includes("maximum")) {
            const newAmount = value ? parseStakeAmount(value) : 0;
            const maxStake = config?.data.validations.stake
                ? parseFloat(config.data.validations.stake.max)
                : payouts.max;
            return newAmount > maxStake;
        }
        return false;
    };

    const handleStakeChange = (value: string) => {
        if (preventExceedingMax(value)) return;

        if (isLandscape) {
            setLocalStake(value);
            validateStakeOnly(value);
            return;
        }

        setLocalStake(value);
        validateAndUpdateStake(value);
    };

    useEffect(() => {
        if (!isLandscape) return;

        if (debouncedStake !== stake) {
            const validation = validateStakeOnly(debouncedStake);
            if (!validation.error) {
                setStake(debouncedStake);
            }
        }
    }, [isLandscape, debouncedStake, stake]);

    const handleSave = () => {
        if (isLandscape) return;

        const validation = validateAndUpdateStake(localStake);
        if (validation.error) return;

        setStake(localStake);
        setBottomSheet(false);
    };

    const content = config && (
        <>
            {!isLandscape && <BottomSheetHeader title="Stake" />}
            <div className="flex flex-col justify-between flex-grow px-6">
                <StakeInputLayout
                    value={localStake}
                    onChange={handleStakeChange}
                    error={error}
                    errorMessage={errorMessage}
                    maxPayout={payouts.max}
                    payoutValues={payouts.values}
                    isDesktop={isLandscape}
                    loading={false} // Set to false since we're using payouts from tradeStore
                    loadingStates={Object.keys(tradeTypeConfigs[trade_type].buttons).reduce(
                        (acc, key) => ({
                            ...acc,
                            [key]: false, // Set all loading states to false
                        }),
                        {}
                    )}
                />
            </div>
            {!isLandscape && (
                <div className="w-full py-6 px-3">
                    <PrimaryButton
                        className="rounded-3xl"
                        onClick={handleSave}
                        disabled={error || debouncedStake === stake}
                    >
                        Save
                    </PrimaryButton>
                </div>
            )}
        </>
    );

    if (isLandscape) {
        return <div className="w-[480px]">{content}</div>;
    }

    return <div className="flex flex-col h-full">{content}</div>;
};
