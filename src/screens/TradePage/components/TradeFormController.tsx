import React, { Suspense, lazy, useEffect, useState, useMemo } from "react";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import { useToastStore } from "@/stores/toastStore";
import { ServerTime } from "@/components/ServerTime";
import { TradeButton } from "@/components/TradeButton";
import { ResponsiveTradeParamLayout } from "@/components/ui/responsive-trade-param-layout";
import { useTradeStore } from "@/stores/tradeStore";
import { tradeTypeConfigs } from "@/config/tradeTypes";
// import { useTradeActions } from "@/hooks/useTradeActions";
import { useClientStore } from "@/stores/clientStore";
import { HowToTrade } from "@/components/HowToTrade";
import { TradeNotification } from "@/components/ui/trade-notification";
import { AccountSwitcher } from "@/components/AccountSwitcher";
import { useProductConfig } from "@/hooks/product/useProductConfig";
import { useProposalStream } from "@/hooks/proposal/useProposal";
import { ProposalRequest } from "@/api/services/proposal/types";

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
}

type ButtonStates = Record<string, ButtonState>;

// Helper function to parse duration string into value and unit
const parseDuration = (durationString: string): [number, string] => {
    const match = durationString.match(/(\d+)\s+(\w+)/);
    if (match) {
        const value = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();
        return [value, unit];
    }
    return [5, "minutes"]; // Default fallback
};

export const TradeFormController: React.FC<TradeFormControllerProps> = ({ isLandscape }) => {
    const { trade_type, instrument, productConfig, duration, stake, allowEquals } = useTradeStore();
    const { fetchProductConfig } = useProductConfig();
    const { setSidebar } = useMainLayoutStore();
    const { toast, hideToast } = useToastStore();
    const { currency, isLoggedIn, account_uuid } = useClientStore();
    // const tradeActions = useTradeActions()
    const config = tradeTypeConfigs[trade_type];

    // Parse duration into value and unit
    const [durationValue, durationUnit] = parseDuration(duration);

    // Memoize the proposal parameters to prevent unnecessary re-subscriptions
    const proposalParams = useMemo(
        () => ({
            product_id: trade_type,
            instrument_id: instrument,
            duration: durationValue,
            duration_unit: durationUnit,
            allow_equals: allowEquals,
            stake: stake,
            // Only include account_uuid when it's not null
            ...(account_uuid ? { account_uuid } : {}),
        }),
        [trade_type, instrument, durationValue, durationUnit, allowEquals, stake, account_uuid]
    );

    // Subscribe to proposal stream at the top level of the component
    const { data: proposalData, error: proposalError } = useProposalStream(
        // Type assertion to satisfy TypeScript
        proposalParams as ProposalRequest,
        { enabled: isLoggedIn && !!account_uuid }
    );

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
        fetchProductConfig(trade_type, instrument);
    }, [trade_type, instrument]);

    // useEffect(() => {
    //   // Create SSE connections for each button's contract type
    //   const cleanupFunctions = tradeTypeConfigs[trade_type].buttons.map(
    //     (button) => {
    //       return createSSEConnection({
    //         params: {
    //           action: "contract_price",
    //           duration: formatDuration(Number(apiDurationValue), apiDurationType),
    //           trade_type: button.contractType,
    //           instrument: "R_100",
    //           currency: currency,
    //           payout: stake,
    //           strike: stake,
    //         },
    //         headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    //         onMessage: (priceData) => {
    //           // Update button state for this specific button
    //           setButtonStates((prev) => ({
    //             ...prev,
    //             [button.actionName]: {
    //               loading: false,
    //               error: null,
    //               payout: Number(priceData.price),
    //               reconnecting: false,
    //             },
    //           }))

    //           // Update payouts in store
    //           const payoutValue = Number(priceData.price)

    //           // Create a map of button action names to their payout values
    //           const payoutValues = Object.keys(buttonStates).reduce(
    //             (acc, key) => {
    //               acc[key] =
    //                 key === button.actionName
    //                   ? payoutValue
    //                   : buttonStates[key]?.payout || 0
    //               return acc
    //             },
    //             {} as Record<string, number>
    //           )

    //           setPayouts({
    //             max: 50000,
    //             values: payoutValues,
    //           })
    //         },
    //         onError: (error) => {
    //           // Update only this button's state on error
    //           setButtonStates((prev) => ({
    //             ...prev,
    //             [button.actionName]: {
    //               ...prev[button.actionName],
    //               loading: false,
    //               error,
    //               reconnecting: true,
    //             },
    //           }))
    //         },
    //         onOpen: () => {
    //           // Reset error and reconnecting state on successful connection
    //           setButtonStates((prev) => ({
    //             ...prev,
    //             [button.actionName]: {
    //               ...prev[button.actionName],
    //               error: null,
    //               reconnecting: false,
    //             },
    //           }))
    //         },
    //       })
    //     }
    //   )

    //   return () => {
    //     cleanupFunctions.forEach((cleanup) => cleanup())
    //   }
    // }, [duration, stake, currency, token])

    // Reset loading states when duration or trade type changes
    useEffect(() => {
        setButtonStates((prevStates) => {
            const initialStates: ButtonStates = {};
            config.buttons.forEach((button: any) => {
                initialStates[button.actionName] = {
                    loading: false,
                    error: null,
                    payout: prevStates[button.actionName]?.payout || 0,
                    reconnecting: false,
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
        if (!isLoggedIn || !account_uuid) return;

        // Set initial loading state for buttons when parameters change
        if (!proposalData && !proposalError) {
            setButtonStates((prevStates) => {
                const initialLoadingStates: ButtonStates = {};
                config.buttons.forEach((button: any) => {
                    initialLoadingStates[button.actionName] = {
                        loading: true,
                        error: null,
                        payout: prevStates[button.actionName]?.payout || 0,
                        reconnecting: false,
                    };
                });
                return initialLoadingStates;
            });
            return;
        }

        // Update button states when data is received
        if (proposalData) {
            const variants = proposalData.data.variants;

            setButtonStates(() => {
                // Create updated button states
                const updatedButtonStates: ButtonStates = {};

                // Map variants to buttons
                config.buttons.forEach((button: any) => {
                    // Find the matching variant for this button
                    const variantType = button.actionName === "buy_rise" ? "rise" : "fall";
                    const variant = variants.find((v) => v.variant === variantType);

                    updatedButtonStates[button.actionName] = {
                        loading: false,
                        error: null,
                        payout: variant ? Number(variant.contract_details.payout) : 0,
                        reconnecting: false,
                    };
                });

                return updatedButtonStates;
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
                    };
                });
                return errorButtonStates;
            });
        }
    }, [proposalData, proposalError, trade_type, isLoggedIn, account_uuid, config.buttons]);

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
                <div className={`flex ${isLoggedIn ? "justify-between" : "justify-end"}`}>
                    {isLoggedIn && <AccountSwitcher />}
                    {isLoggedIn ? (
                        <button
                            className="text-sm px-5 py-2 font-semibold rounded-3xl bg-color-brand-700 hover:bg-color-brand-600 text-black"
                            // onClick={}
                        >
                            Deposit
                        </button>
                    ) : (
                        <a
                            href="/login"
                            className="text-sm px-5 py-2 font-semibold rounded-3xl bg-color-brand-700 hover:bg-color-brand-600 text-black"
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
                                    <StakeField className="w-full" />
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
                                        buttonStates[button.actionName]?.loading
                                        // Commenting it as api is not working we'll enable it once api is working
                                        // buttonStates[button.actionName]?.error !== null
                                    }
                                    loading={
                                        buttonStates[button.actionName]?.loading
                                        // Commenting it as api is not working we'll enable it once api is working
                                        // buttonStates[button.actionName]?.reconnecting
                                    }
                                    error={buttonStates[button.actionName]?.error}
                                    onClick={() => {
                                        if (!isLoggedIn) return;
                                        // Comment out actual API call but keep the success flow
                                        // await tradeActions[button.actionName]()

                                        // Open positions sidebar only in desktop view
                                        if (isLandscape) {
                                            setSidebar("positions");
                                        }

                                        // Show trade notification
                                        toast({
                                            content: (
                                                <TradeNotification
                                                    stake={`${10.0} ${currency}`}
                                                    market="Volatility 75 Index"
                                                    type={button.title}
                                                    onClose={hideToast}
                                                />
                                            ),
                                            variant: "default",
                                            duration: 3000,
                                            position: isLandscape ? "bottom-left" : "top-center",
                                        });
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
                                        <StakeField />
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
                                        buttonStates[button.actionName]?.loading
                                        // ||
                                        // Commenting it as api is not working we'll enable it once api is working
                                        // buttonStates[button.actionName]?.error !== null
                                    }
                                    loading={
                                        buttonStates[button.actionName]?.loading
                                        // ||
                                        // Commenting it as api is not working we'll enable it once api is working
                                        // buttonStates[button.actionName]?.reconnecting
                                    }
                                    error={buttonStates[button.actionName]?.error}
                                    onClick={() => {
                                        if (!isLoggedIn) return;
                                        // Comment out actual API call but keep the success flow
                                        // await tradeActions[button.actionName]()

                                        // Open positions sidebar only in desktop view
                                        if (isLandscape) {
                                            setSidebar("positions");
                                        }

                                        // Show trade notification
                                        toast({
                                            content: (
                                                <TradeNotification
                                                    stake={`${10.0} ${currency}`}
                                                    market="Volatility 75 Index"
                                                    type={button.title}
                                                    onClose={hideToast}
                                                />
                                            ),
                                            variant: "default",
                                            duration: 3000,
                                            position: isLandscape ? "bottom-left" : "top-center",
                                        });
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
