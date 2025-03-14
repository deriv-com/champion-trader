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
    error: Event | null;
    payout: number;
    reconnecting?: boolean;
}

type ButtonStates = Record<string, ButtonState>;

export const TradeFormController: React.FC<TradeFormControllerProps> = ({ isLandscape }) => {
    const { trade_type, instrument } = useTradeStore();
    const { fetchProductConfig } = useProductConfig();
    const { setSidebar } = useMainLayoutStore();
    const { toast, hideToast } = useToastStore();
    const { currency, isLoggedIn } = useClientStore();
    const tradeActions = useTradeActions();
    const config = tradeTypeConfigs[trade_type];

    const [buttonStates, setButtonStates] = useState<ButtonStates>(() => {
        // Initialize states for all buttons in the current trade type
        const initialStates: ButtonStates = {};
        tradeTypeConfigs[trade_type].buttons.forEach((button) => {
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

    // Reset loading states when duration or trade type changes
    useEffect(() => {
        const initialStates: ButtonStates = {};
        tradeTypeConfigs[trade_type].buttons.forEach((button) => {
            initialStates[button.actionName] = {
                loading: false,
                error: null,
                payout: buttonStates[button.actionName]?.payout || 0,
                reconnecting: false,
            };
        });
        setButtonStates(initialStates);
    }, [trade_type]);

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
                                                  // added for demo proposes will change it to 0 once api is connected
                                                  buttonStates[button.actionName]?.payout || 10
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
                                                        stake={`${stake} ${currency}`}
                                                        market={instrument}
                                                        type={button.title}
                                                        onClose={hideToast}
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
                                                  buttonStates[button.actionName]?.payout || 10
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
                                                        stake={`${stake} ${currency}`}
                                                        market={instrument}
                                                        type={button.title}
                                                        onClose={hideToast}
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
