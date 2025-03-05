import React, { Suspense, lazy, useEffect, useState } from "react";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import { useToastStore } from "@/stores/toastStore";
import { ServerTime } from "@/components/ServerTime";
import { TradeButton } from "@/components/TradeButton";
import { ResponsiveTradeParamLayout } from "@/components/ui/responsive-trade-param-layout";
import { MobileTradeFieldCard } from "@/components/ui/mobile-trade-field-card";
import { DesktopTradeFieldCard } from "@/components/ui/desktop-trade-field-card";
import { useTradeStore } from "@/stores/tradeStore";
import { tradeTypeConfigs } from "@/config/tradeTypes";
import { useTradeActions } from "@/hooks/useTradeActions";
import { useClientStore } from "@/stores/clientStore";
import { WebSocketError } from "@/services/api/websocket/types";
import { HowToTrade } from "@/components/HowToTrade";
import { TradeNotification } from "@/components/ui/trade-notification";
import { useProductConfig } from "@/hooks/useProductConfig";

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
  error: Event | WebSocketError | null;
  payout: number;
  reconnecting?: boolean;
}

type ButtonStates = Record<string, ButtonState>;

export const TradeFormController: React.FC<TradeFormControllerProps> = ({
  isLandscape,
}) => {
  const { trade_type, instrument } = useTradeStore();
  const { fetchProductConfig } = useProductConfig();
  const { setSidebar } = useMainLayoutStore();
  const { toast, hideToast } = useToastStore();
  const { currency, isLoggedIn } = useClientStore();
  // const tradeActions = useTradeActions()
  const config = tradeTypeConfigs[trade_type];
  const [isStakeSelected, setIsStakeSelected] = useState(false);
  const [stakeError, setStakeError] = useState(false);

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
  }, [trade_type, instrument, fetchProductConfig]);
  // Commented out API calls for now
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
          ? "w-[30%] max-w-[272px] flex flex-col justify-start px-4 py-2 "
          : ""
      }`}
    >
      <div className={isLandscape ? "pb-2" : "pt-1 px-4"} id="how-to-trade">
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
                  <div className="bg-white rounded-lg">
                    <DesktopTradeFieldCard
                      isSelected={isStakeSelected}
                      error={stakeError}
                    >
                      <StakeField
                        className="w-full"
                        onSelect={(selected) => setIsStakeSelected(selected)}
                        onError={(error) => setStakeError(error)}
                      />
                    </DesktopTradeFieldCard>
                  </div>
                </Suspense>
              )}
            </div>
            {config.fields.allowEquals && <EqualTradeController />}
          </div>

          <div className="flex flex-col py-2 gap-2" id="trade-buttons">
            {config.buttons.map((button) => (
              <Suspense
                key={button.actionName}
                fallback={<div>Loading...</div>}
              >
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
                      variant: "black",
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
            <div className="p-4">
              <ResponsiveTradeParamLayout>
                {config.fields.duration && (
                  <Suspense fallback={<div>Loading duration field...</div>}>
                    <MobileTradeFieldCard
                      onClick={() => {
                        const durationField = document.querySelector(
                          'button[aria-label^="Duration"]'
                        );
                        if (durationField) {
                          (durationField as HTMLButtonElement).click();
                        }
                      }}
                    >
                      <DurationField />
                    </MobileTradeFieldCard>
                  </Suspense>
                )}
                {config.fields.stake && (
                  <Suspense fallback={<div>Loading stake field...</div>}>
                    <MobileTradeFieldCard
                      onClick={() => {
                        const stakeField = document.querySelector(
                          'button[aria-label^="Stake"]'
                        );
                        if (stakeField) {
                          (stakeField as HTMLButtonElement).click();
                        }
                      }}
                    >
                      <StakeField />
                    </MobileTradeFieldCard>
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
              <Suspense
                key={button.actionName}
                fallback={<div>Loading...</div>}
              >
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
                      variant: "black",
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
