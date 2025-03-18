import React, { Suspense, lazy, useEffect, useState } from "react";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import { useToastStore } from "@/stores/toastStore";
import { ServerTime } from "@/components/ServerTime";
import { TradeButton } from "@/components/TradeButton";
import { ResponsiveTradeParamLayout } from "@/components/ui/responsive-trade-param-layout";
import { useTradeStore } from "@/stores/tradeStore";
import { tradeTypeConfigs } from "@/config/tradeTypes";
import { useTradeActions } from "@/hooks/useTradeActions";
import { useClientStore } from "@/stores/clientStore";
import { HowToTrade } from "@/components/HowToTrade";
import { TradeNotification } from "@/components/ui/trade-notification";
import { AccountSwitcher } from "@/components/AccountSwitcher";
import { useProductConfig } from "@/hooks/product/useProductConfig";
import { useProposalStream } from "@/hooks/proposal/useProposal";
import { validateStake } from "@/components/Stake/utils/validation";
import { parseStakeAmount } from "@/utils/stake";
import { StandaloneStopwatchBoldIcon } from "@deriv/quill-icons";

// Lazy load components
const DurationField = lazy(() =>
    import("@/components/Duration").then((module) => ({
        default: module.DurationField,
    }))
);

const StakeField = lazy(() =>
    import("@/components/Stake").then((module) => ({
        default: module.StakeField,
    }))
);

const EqualTradeController = lazy(() =>
    import("@/components/EqualTrade").then((module) => ({
        default: module.EqualTradeController,
    }))
);

interface TradeFormControllerProps {
    isLandscape: boolean;
}

interface ButtonState {
    loading: boolean;
    error: Event | { error: string } | null;
    payout: number;
    reconnecting?: boolean;
    validationError?: string | null;
}

interface ValidationResult {
    error: boolean;
    message?: string;
}

// Validate payout
const validatePayout = (
    payout: number,
    minPayout: number,
    maxPayout: number,
    currency: string
): ValidationResult => {
    if (payout < minPayout) {
        return {
            error: true,
            message: `Minimum payout is ${minPayout} ${currency}`,
        };
    }

    if (payout > maxPayout) {
        return {
            error: true,
            message: `Maximum payout is ${maxPayout} ${currency}`,
        };
    }

    return { error: false };
};

type ButtonStates = Record<string, ButtonState>;

// Validate trade parameters (stake and payout)
const validateTradeParameters = (
    buttonState: ButtonState | undefined,
    stake: string,
    productConfig: any,
    currency: string
): { isValid: boolean; errorMessage: string | null } => {
    console.log({ stake });
    if (!productConfig?.data) {
        return { isValid: true, errorMessage: null }; // Default to valid if no config
    }

    const stakeValidation = productConfig.data.validations.stake;
    const payoutValidation = productConfig.data.validations.payout;

    if (!buttonState) {
        return { isValid: false, errorMessage: "Button state not available" };
    }

    // Parse stake value
    const stakeValue = parseStakeAmount(stake || "0");

    // Validate stake
    const stakeResult = validateStake({
        amount: stakeValue,
        minStake: parseFloat(stakeValidation.min),
        maxStake: parseFloat(stakeValidation.max),
        currency,
    });

    if (stakeResult.error) {
        return { isValid: false, errorMessage: stakeResult.message || null };
    }

    // Validate payout
    const payoutResult = validatePayout(
        buttonState.payout,
        parseFloat(payoutValidation.min),
        parseFloat(payoutValidation.max),
        currency
    );

    if (payoutResult.error) {
        return { isValid: false, errorMessage: payoutResult.message || null };
    }

    return { isValid: true, errorMessage: null };
};

export const TradeFormController: React.FC<TradeFormControllerProps> = ({ isLandscape }) => {
    const { trade_type, instrument, productConfig, setPayouts, stake, setStake } = useTradeStore();
    const { fetchProductConfig } = useProductConfig();
    const { setSidebar } = useMainLayoutStore();
    const { toast, hideToast } = useToastStore();
    const { currency, isLoggedIn } = useClientStore();
    const tradeActions = useTradeActions();
    const config = tradeTypeConfigs[trade_type];

    // Track stake validation errors separately to persist them across payout updates
    const [stakeValidationError, setStakeValidationError] = useState<string | null>(null);

    // Parse duration into value and unit

    // Subscribe to proposal stream at the top level of the component
    const {
        data: proposalData,
        error: proposalError,
        isConnecting: isProposalConnecting,
    } = useProposalStream();

    const [buttonStates, setButtonStates] = useState<ButtonStates>(() => {
        // Initialize states for all buttons in the current trade type
        const initialStates: ButtonStates = {};
        config.buttons.forEach((button: any) => {
            initialStates[button.actionName] = {
                loading: true,
                error: null,
                payout: 0,
                reconnecting: false,
            };
        });
        return initialStates;
    });

    // Fetch product config when trade_type changes
    useEffect(() => {
        if (trade_type && instrument) {
            fetchProductConfig(trade_type, instrument);
        }
    }, [trade_type, instrument]);

    // Reset button states when trade type changes
    useEffect(() => {
        setButtonStates((prevStates) => {
            const initialStates: ButtonStates = {};
            config.buttons.forEach((button: any) => {
                initialStates[button.actionName] = {
                    loading: false,
                    error: null,
                    payout: prevStates[button.actionName]?.payout || 0,
                    reconnecting: false,
                    // Preserve any validation errors when trade type changes
                    validationError: prevStates[button.actionName]?.validationError || null,
                };
            });
            return initialStates;
        });
    }, [trade_type, config.buttons]);

    // Preload components based on metadata
    useEffect(() => {
        if (config.metadata?.preloadFields) {
            // Preload field components
            if (config.fields.duration) {
                import("@/components/Duration");
            }
            if (config.fields.stake) {
                import("@/components/Stake");
            }
            if (config.fields.allowEquals) {
                import("@/components/EqualTrade");
            }
        }
    }, [trade_type, config]);

    // Process proposal data and update button states
    useEffect(() => {
        if (!productConfig?.data) return;

        // Set initial loading state for buttons when parameters change
        if (!proposalData && !proposalError) {
            setButtonStates((prevStates) => {
                // Create a new state object based on previous state
                const initialLoadingStates: ButtonStates = {};
                config.buttons.forEach((button: any) => {
                    // Preserve existing payout and validationError values from previous state
                    initialLoadingStates[button.actionName] = {
                        loading: true,
                        error: null,
                        payout: prevStates[button.actionName]?.payout || 0,
                        reconnecting: false,
                        // Also preserve any existing validation errors
                        validationError: prevStates[button.actionName]?.validationError || null,
                    };
                });
                return initialLoadingStates;
            });
            return;
        }

        // Update button states when data is received
        if (proposalData) {
            const { variants } = proposalData.data;

            setButtonStates((prevStates) => {
                // Create updated button states
                const updatedButtonStates: ButtonStates = {};

                // Map variants to buttons
                config.buttons.forEach((button: any) => {
                    // Find the matching variant for this button
                    const variantType = button.actionName === "buy_rise" ? "rise" : "fall";
                    const variant = variants.find((v) => v.variant === variantType);
                    const payout = variant ? Number(variant.contract_details.payout) : 0;

                    // Preserve stake validation error if it exists
                    updatedButtonStates[button.actionName] = {
                        loading: false,
                        error: null,
                        payout: payout || prevStates[button.actionName]?.payout,
                        reconnecting: false,
                        validationError: stakeValidationError, // Use the separate stake validation state
                    };

                    // If no stake error, check payout validation
                    if (!stakeValidationError && productConfig?.data) {
                        const payoutValidation = productConfig.data.validations.payout;
                        const payoutResult = validatePayout(
                            payout,
                            parseFloat(payoutValidation.min),
                            parseFloat(payoutValidation.max),
                            currency
                        );

                        if (payoutResult.error) {
                            updatedButtonStates[button.actionName].validationError =
                                payoutResult.message || null;
                        }
                    }
                });

                return updatedButtonStates;
            });

            // Update payouts in store
            const payoutValues = config.buttons.reduce(
                (acc, button) => {
                    const variantType = button.actionName === "buy_rise" ? "rise" : "fall";
                    const variant = variants.find((v) => v.variant === variantType);
                    acc[button.actionName] = variant ? Number(variant.contract_details.payout) : 0;
                    return acc;
                },
                {} as Record<string, number>
            );

            // Set payouts in store
            setPayouts({
                max: productConfig?.data.validations.payout.max
                    ? Number(productConfig.data.validations.payout.max)
                    : 50000,
                values: payoutValues,
            });
        }

        // Handle errors
        if (proposalError) {
            // Update all buttons to show error state
            setButtonStates((prevStates) => {
                const errorButtonStates = { ...prevStates };
                Object.keys(errorButtonStates).forEach((key) => {
                    errorButtonStates[key] = {
                        ...errorButtonStates[key],
                        loading: false,
                        error:
                            proposalError instanceof Error
                                ? { error: proposalError.message }
                                : proposalError,
                        reconnecting: true,
                        // Preserve stake validation errors
                        validationError: stakeValidationError,
                    };
                });
                return errorButtonStates;
            });
        }
    }, [
        proposalData,
        proposalError,
        trade_type,
        config.buttons,
        productConfig,
        stakeValidationError,
        currency,
    ]);

    // Validate all trade parameters (stake and payout) for all buttons
    const validateAllTradeParameters = () => {
        if (!productConfig?.data) return;

        const payoutValidation = productConfig.data.validations.payout;
        const stakeValidation = productConfig.data.validations.stake;

        // First validate stake if needed
        if (!stakeValidationError && stake) {
            const stakeValue = parseStakeAmount(stake || "0");
            const stakeResult = validateStake({
                amount: stakeValue,
                minStake: parseFloat(stakeValidation.min),
                maxStake: parseFloat(stakeValidation.max),
                currency,
            });

            // If stake is invalid, update stake validation error
            if (stakeResult.error) {
                setStakeValidationError(stakeResult.message || null);

                // Update button states with stake error
                setButtonStates((prevStates) => {
                    const updatedStates = { ...prevStates };
                    Object.keys(updatedStates).forEach((buttonActionName) => {
                        updatedStates[buttonActionName] = {
                            ...updatedStates[buttonActionName],
                            validationError: stakeResult.message || null,
                        };
                    });
                    return updatedStates;
                });

                return; // Exit early if stake is invalid
            }
        }

        // Then validate payout for each button
        setButtonStates((prevStates) => {
            const updatedStates = { ...prevStates };

            // Check each button
            Object.keys(updatedStates).forEach((buttonActionName) => {
                const buttonState = updatedStates[buttonActionName];

                // If there's a stake validation error, keep it
                if (stakeValidationError) {
                    updatedStates[buttonActionName] = {
                        ...buttonState,
                        validationError: stakeValidationError,
                    };
                    return;
                }

                // Otherwise, validate payout
                const payoutResult = validatePayout(
                    buttonState.payout,
                    parseFloat(payoutValidation.min),
                    parseFloat(payoutValidation.max),
                    currency
                );

                if (payoutResult.error) {
                    updatedStates[buttonActionName] = {
                        ...buttonState,
                        validationError: payoutResult.message || null,
                    };
                } else {
                    // Clear validation error if both stake and payout are valid
                    updatedStates[buttonActionName] = {
                        ...buttonState,
                        validationError: null,
                    };
                }
            });

            return updatedStates;
        });
    };

    // Handle stake validation errors
    const handleStakeError = (hasError: boolean, errorMessage: string | null) => {
        // Update the separate stake validation state
        setStakeValidationError(hasError ? errorMessage : null);

        // Also update button states
        setButtonStates((prevStates) => {
            const updatedStates = { ...prevStates };

            // Update all buttons with the stake validation error
            Object.keys(updatedStates).forEach((buttonActionName) => {
                updatedStates[buttonActionName] = {
                    ...updatedStates[buttonActionName],
                    validationError: hasError ? errorMessage : null,
                };
            });

            return updatedStates;
        });

        // If stake is now valid, re-validate payout
        if (!hasError) {
            // Use setTimeout to ensure state updates have completed
            setTimeout(() => validateAllTradeParameters(), 0);
        }
    };

    // Update payout validation errors when productConfig or currency changes
    useEffect(() => {
        if (!productConfig?.data) {
            return;
        }

        const payoutValidation = productConfig.data.validations.payout;

        setButtonStates((prevStates) => {
            const updatedStates = { ...prevStates };

            // Only validate payout for each button
            Object.keys(updatedStates).forEach((buttonActionName) => {
                const buttonState = updatedStates[buttonActionName];

                // Skip if there's already a stake validation error
                if (buttonState.validationError) return;

                // Validate payout
                const payoutResult = validatePayout(
                    buttonState.payout,
                    parseFloat(payoutValidation.min),
                    parseFloat(payoutValidation.max),
                    currency
                );

                if (payoutResult.error) {
                    updatedStates[buttonActionName] = {
                        ...buttonState,
                        validationError: payoutResult.message || null,
                    };
                }
            });

            return updatedStates;
        });
    }, [productConfig, currency]); // Only run for productConfig and currency changes

    return (
        <div
            id="trade-section"
            className={`${
                isLandscape
                    ? "w-[30%] max-w-[272px] flex flex-col justify-start px-4 gap-2"
                    : "bg-theme"
            }`}
        >
            {isLandscape ? (
                <div className={`flex ${isLoggedIn ? "justify-between pb-2" : "justify-end"}`}>
                    {isLoggedIn && <AccountSwitcher />}
                    {isLoggedIn ? (
                        <button
                            className="text-sm font-semibold rounded-3xl bg-color-brand-700 hover:bg-color-brand-600 text-black flex h-8 min-w-[80px] px-4 justify-center items-center"
                            // onClick={}
                        >
                            Deposit
                        </button>
                    ) : (
                        <a
                            href="/login"
                            className="text-sm font-semibold rounded-3xl bg-color-brand-700 hover:bg-color-brand-600 text-black flex h-8 min-w-[80px] px-4 justify-center items-center"
                        >
                            Log in
                        </a>
                    )}
                </div>
            ) : (
                <></>
            )}
            <div className={isLandscape ? "pb-2" : "px-4"} id="how-to-trade">
                <HowToTrade />
            </div>
            {isLandscape ? (
                // Desktop layout
                <div className="flex-1 flex flex-col">
                    <div
                        className="flex flex-col gap-0"
                        onMouseDown={() => {
                            // When clicking anywhere in the trade fields section, hide any open controllers
                            const event = new MouseEvent("mousedown", {
                                bubbles: true,
                                cancelable: true,
                            });
                            document.dispatchEvent(event);
                        }}
                    >
                        <div className="flex flex-col gap-2">
                            {config.fields.duration && (
                                <Suspense fallback={<div>Loading duration field...</div>}>
                                    <DurationField className="w-full" />
                                </Suspense>
                            )}
                            {config.fields.stake && (
                                <Suspense fallback={<div>Loading stake field...</div>}>
                                    <StakeField
                                        className="w-full"
                                        stake={stake}
                                        setStake={setStake}
                                        productConfig={productConfig}
                                        currency={currency}
                                        isConfigLoading={!productConfig}
                                        handleError={handleStakeError}
                                    />
                                </Suspense>
                            )}
                        </div>
                        {config.fields.allowEquals && <EqualTradeController />}
                    </div>

                    <div className="flex flex-col py-2 gap-2" id="trade-buttons">
                        {config.buttons.map((button) => (
                            <Suspense key={button.actionName} fallback={<div>Loading...</div>}>
                                <TradeButton
                                    className={`${button.className} rounded-[16px] h-[48px] py-3 [&>div]:px-2 [&_span]:text-sm`}
                                    title={button.title}
                                    label={button.label}
                                    value={
                                        buttonStates[button.actionName]?.loading
                                            ? "Loading..."
                                            : `${
                                                  buttonStates[button.actionName]?.payout ||
                                                  (productConfig?.data.validations.payout.max
                                                      ? Number(
                                                            productConfig.data.validations.payout
                                                                .max
                                                        )
                                                      : 0)
                                              } ${currency}`
                                    }
                                    title_position={button.position}
                                    disabled={
                                        buttonStates[button.actionName]?.loading ||
                                        Boolean(buttonStates[button.actionName]?.validationError)
                                        // Commenting it as api is not working we'll enable it once api is working
                                        // buttonStates[button.actionName]?.error !== null
                                    }
                                    loading={
                                        buttonStates[button.actionName]?.loading ||
                                        isProposalConnecting
                                        // Commenting it as api is not working we'll enable it once api is working
                                        // buttonStates[button.actionName]?.reconnecting
                                    }
                                    error={
                                        buttonStates[button.actionName]?.validationError
                                            ? {
                                                  error:
                                                      buttonStates[button.actionName]
                                                          ?.validationError || "",
                                              }
                                            : buttonStates[button.actionName]?.error
                                    }
                                    onClick={async () => {
                                        if (!isLoggedIn) return;

                                        try {
                                            // Call the API
                                            await tradeActions[button.actionName]();

                                            // Open positions sidebar only in desktop view
                                            if (isLandscape) {
                                                setSidebar("positions");
                                            }

                                            // Show trade notification
                                            toast({
                                                content: (
                                                    <TradeNotification
                                                        stake={`Stake: ${stake} ${currency}`}
                                                        market={instrument}
                                                        type={button.title}
                                                        onClose={hideToast}
                                                        icon={
                                                            <StandaloneStopwatchBoldIcon
                                                                fill="#53b9ff"
                                                                iconSize="md"
                                                                className="rounded-full bg-[#2C9AFF3D]"
                                                            />
                                                        }
                                                    />
                                                ),
                                                variant: "default",
                                                duration: 3000,
                                                position: isLandscape
                                                    ? "bottom-left"
                                                    : "top-center",
                                            });
                                        } catch (error) {
                                            // Error is already handled in the trade action
                                        }
                                    }}
                                />
                            </Suspense>
                        ))}
                    </div>
                    <div className="mt-auto">
                        <ServerTime />
                    </div>
                </div>
            ) : (
                // Mobile layout
                <>
                    <div id="trade-fields" className="flex flex-col">
                        <div className="px-4 py-3">
                            <ResponsiveTradeParamLayout>
                                {config.fields.duration && (
                                    <Suspense fallback={<div>Loading duration field...</div>}>
                                        <DurationField />
                                    </Suspense>
                                )}
                                {config.fields.stake && (
                                    <Suspense fallback={<div>Loading stake field...</div>}>
                                        <StakeField
                                            stake={stake}
                                            setStake={setStake}
                                            productConfig={productConfig}
                                            currency={currency}
                                            isConfigLoading={!productConfig}
                                            handleError={handleStakeError}
                                        />
                                    </Suspense>
                                )}
                            </ResponsiveTradeParamLayout>
                            {config.fields.allowEquals && (
                                <Suspense fallback={<div>Loading equals controller...</div>}>
                                    <div className="mt-4">
                                        <EqualTradeController />
                                    </div>
                                </Suspense>
                            )}
                        </div>
                    </div>

                    <div className="flex p-4 pt-0 gap-2" id="trade-buttons">
                        {config.buttons.map((button) => (
                            <Suspense key={button.actionName} fallback={<div>Loading...</div>}>
                                <TradeButton
                                    className={`${button.className} rounded-[32px]`}
                                    title={button.title}
                                    label={button.label}
                                    value={
                                        buttonStates[button.actionName]?.loading
                                            ? "Loading..."
                                            : `${
                                                  buttonStates[button.actionName]?.payout ||
                                                  (productConfig?.data.validations.payout.max
                                                      ? Number(
                                                            productConfig.data.validations.payout
                                                                .max
                                                        )
                                                      : 0)
                                              } ${currency}`
                                    }
                                    title_position={button.position}
                                    disabled={
                                        buttonStates[button.actionName]?.loading ||
                                        Boolean(buttonStates[button.actionName]?.validationError)
                                        // ||
                                        // Commenting it as api is not working we'll enable it once api is working
                                        // buttonStates[button.actionName]?.error !== null
                                    }
                                    loading={
                                        buttonStates[button.actionName]?.loading ||
                                        isProposalConnecting
                                        // ||
                                        // Commenting it as api is not working we'll enable it once api is working
                                        // buttonStates[button.actionName]?.reconnecting
                                    }
                                    error={
                                        buttonStates[button.actionName]?.validationError
                                            ? {
                                                  error:
                                                      buttonStates[button.actionName]
                                                          ?.validationError || "",
                                              }
                                            : buttonStates[button.actionName]?.error
                                    }
                                    onClick={async () => {
                                        if (!isLoggedIn) return;

                                        try {
                                            // Call the API
                                            await tradeActions[button.actionName]();

                                            // Open positions sidebar only in desktop view
                                            if (isLandscape) {
                                                setSidebar("positions");
                                            }

                                            // Show trade notification
                                            toast({
                                                content: (
                                                    <TradeNotification
                                                        stake={`Stake: ${stake} ${currency}`}
                                                        market={instrument}
                                                        type={button.title}
                                                        onClose={hideToast}
                                                        icon={
                                                            <StandaloneStopwatchBoldIcon
                                                                fill="#53b9ff"
                                                                iconSize="md"
                                                                className="rounded-full bg-[#2C9AFF3D]"
                                                            />
                                                        }
                                                    />
                                                ),
                                                variant: "default",
                                                duration: 3000,
                                                position: isLandscape
                                                    ? "bottom-left"
                                                    : "top-center",
                                            });
                                        } catch (error) {
                                            // Error is already handled in the trade action
                                        }
                                    }}
                                />
                            </Suspense>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
