import React, { Suspense, lazy, useEffect, useState } from "react";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import { useToastStore } from "@/stores/toastStore";
import { ServerTime } from "@/components/ServerTime";
import { TradeButton } from "@/components/TradeButton";
import { ResponsiveTradeParamLayout } from "@/components/ui/responsive-trade-param-layout";
import { useTradeStore } from "@/stores/tradeStore";
import { tradeTypeConfigs } from "@/config/tradeTypes";
import { useClientStore } from "@/stores/clientStore";
import { HowToTrade } from "@/components/HowToTrade";
import { TradeNotification } from "@/components/ui/trade-notification";
import { AccountSwitcher } from "@/components/AccountSwitcher";
import { useProductConfig } from "@/hooks/product/useProductConfig";
import { useProposalStream } from "@/hooks/proposal/useProposal";

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

export const TradeFormController: React.FC<TradeFormControllerProps> = ({ isLandscape }) => {
    const { trade_type, instrument, productConfig } = useTradeStore();
    const { refetch } = useProductConfig();
    const { setSidebar } = useMainLayoutStore();
    const { toast, hideToast } = useToastStore();
    const { currency, isLoggedIn } = useClientStore();
    // const tradeActions = useTradeActions()
    const config = tradeTypeConfigs[trade_type];

    // Parse duration into value and unit

    // Subscribe to proposal stream at the top level of the component
    const { data: proposalData, error: proposalError } = useProposalStream();

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
        refetch();
    }, [trade_type, instrument]);

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
        if (!productConfig?.data) return;

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
    }, [proposalData, proposalError, trade_type, config.buttons, productConfig]);

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
