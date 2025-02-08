import React, { Suspense, lazy, useEffect, useState } from "react"
import { TradeButton } from "@/components/TradeButton"
import { ResponsiveTradeParamLayout } from "@/components/ui/responsive-trade-param-layout"
import { MobileTradeFieldCard } from "@/components/ui/mobile-trade-field-card"
import { DesktopTradeFieldCard } from "@/components/ui/desktop-trade-field-card"
import { useTradeStore } from "@/stores/tradeStore"
import { tradeTypeConfigs } from "@/config/tradeTypes"
import { useTradeActions } from "@/hooks/useTradeActions"
import { formatDuration } from "@/config/duration"
import { convertHourToMinutes } from "@/utils/duration"
import { createSSEConnection } from "@/services/api/sse/createSSEConnection"
import { useClientStore } from "@/stores/clientStore"
import { WebSocketError } from "@/services/api/websocket/types"
import { DurationRangesResponse } from "@/services/api/rest/duration/types"

// Lazy load components
const DurationField = lazy(() => 
  import("@/components/Duration").then(module => ({
    default: module.DurationField
  }))
);

const StakeField = lazy(() => 
  import("@/components/Stake").then(module => ({
    default: module.StakeField
  }))
);

const EqualTradeController = lazy(() => 
  import("@/components/EqualTrade").then(module => ({
    default: module.EqualTradeController
  }))
);

interface TradeFormControllerProps {
  isLandscape: boolean
}

interface ButtonState {
  loading: boolean;
  error: Event | WebSocketError | null;
  payout: number;
}

type ButtonStates = Record<string, ButtonState>;

export const TradeFormController: React.FC<TradeFormControllerProps> = ({ isLandscape }) => {
  const { trade_type, duration, setPayouts, stake } = useTradeStore();
  const { token, currency } = useClientStore();
  const tradeActions = useTradeActions();
  const config = tradeTypeConfigs[trade_type];

  const [buttonStates, setButtonStates] = useState<ButtonStates>(() => {
    // Initialize states for all buttons in the current trade type
    const initialStates: ButtonStates = {};
    tradeTypeConfigs[trade_type].buttons.forEach(button => {
      initialStates[button.actionName] = {
        loading: true,
        error: null,
        payout: 0
      };
    });
    return initialStates;
  });

  // Parse duration string to get value and type (e.g. "1 tick" -> { value: 1, type: "tick" } or "1:30 hour" -> { value: "1:30", type: "hour" })
  const [value, type] = duration.split(" ");
  
  // Handle duration value and type for API call
  let apiDurationValue = value;
  let apiDurationType = type as keyof DurationRangesResponse;

  // Convert hours with minutes to total minutes for API call
  if (type === "hour" && value.includes(":")) {
    apiDurationValue = convertHourToMinutes(value).toString();
    apiDurationType = "minute";
  } else if (type === "hour") {
    apiDurationValue = value.split(":")[0];
  }

  useEffect(() => {
    // Create SSE connections for each button's contract type
    const cleanupFunctions = tradeTypeConfigs[trade_type].buttons.map(button => {
      return createSSEConnection({
        params: {
          action: 'contract_price',
          duration: formatDuration(Number(apiDurationValue), apiDurationType),
          trade_type: button.contractType,
          instrument: "R_100",
          currency: currency,
          payout: stake,
          strike: stake
        },
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
        onMessage: (priceData) => {
          // Update button state for this specific button
          setButtonStates(prev => ({
            ...prev,
            [button.actionName]: {
              loading: false,
              error: null,
              payout: Number(priceData.price)
            }
          }));

          // Update payouts in store
          const payoutValue = Number(priceData.price);
          
          // Create a map of button action names to their payout values
          const payoutValues = Object.keys(buttonStates).reduce((acc, key) => {
            acc[key] = key === button.actionName ? payoutValue : buttonStates[key]?.payout || 0;
            return acc;
          }, {} as Record<string, number>);

          setPayouts({
            max: 50000,
            values: payoutValues
          });
        },
        onError: (error) => {
          // Update only this button's state on error
          setButtonStates(prev => ({
            ...prev,
            [button.actionName]: {
              ...prev[button.actionName],
              loading: false,
              error
            }
          }));
        }
      });
    });

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };

  }, [duration, stake, currency, token]);

  // Reset loading states when duration or trade type changes
  useEffect(() => {
    const initialStates: ButtonStates = {};
    tradeTypeConfigs[trade_type].buttons.forEach(button => {
      initialStates[button.actionName] = {
        loading: true,
        error: null,
        payout: buttonStates[button.actionName]?.payout || 0
      };
    });
    setButtonStates(initialStates);
  }, [duration, trade_type]);

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
      className={`${isLandscape ? 'w-[30%] min-w-[260px] max-w-[360px] flex flex-col justify-start mt-[78px] border-l border-gray-300 border-opacity-20' : ''}`}
    >
      <div id="trade-fields">
        {isLandscape ? (
          // Desktop layout
          <div 
            className="flex flex-col gap-4 pt-4 pb-2 px-4"
            onMouseDown={() => {
              // When clicking anywhere in the trade fields section, hide any open controllers
              const event = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
              });
              document.dispatchEvent(event);
            }}
          >
            <div className="flex flex-col gap-2">
              {config.fields.duration && (
                <Suspense fallback={<div>Loading duration field...</div>}>
                  <DesktopTradeFieldCard>
                    <DurationField className="w-full" />
                  </DesktopTradeFieldCard>
                </Suspense>
              )}
              {config.fields.stake && (
                <Suspense fallback={<div>Loading stake field...</div>}>
                  <DesktopTradeFieldCard>
                    <StakeField className="w-full" />
                  </DesktopTradeFieldCard>
                </Suspense>
              )}
            </div>
            {config.fields.allowEquals && <EqualTradeController />}
          </div>
        ) : (
          // Mobile layout
          <div className="p-4">
            <ResponsiveTradeParamLayout>
              {config.fields.duration && (
                <Suspense fallback={<div>Loading duration field...</div>}>
                  <MobileTradeFieldCard onClick={() => {
                    const durationField = document.querySelector('button[aria-label^="Duration"]');
                    if (durationField) {
                      (durationField as HTMLButtonElement).click();
                    }
                  }}>
                    <DurationField />
                  </MobileTradeFieldCard>
                </Suspense>
              )}
              {config.fields.stake && (
                <Suspense fallback={<div>Loading stake field...</div>}>
                  <MobileTradeFieldCard onClick={() => {
                    const stakeField = document.querySelector('button[aria-label^="Stake"]');
                    if (stakeField) {
                      (stakeField as HTMLButtonElement).click();
                    }
                  }}>
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
        )}
      </div>

      <div className={`flex ${isLandscape ? 'flex-col py-2' : ''} gap-2 p-4`} id="trade-buttons">
        {config.buttons.map((button) => (
          <Suspense key={button.actionName} fallback={<div>Loading...</div>}>
            <TradeButton
              className={`${button.className} rounded-[32px] ${
                isLandscape ? 'h-[48px] py-3 [&>div]:px-2 [&_span]:text-sm' : ''
              }`}
              title={button.title}
              label={button.label}
              value={buttonStates[button.actionName]?.loading 
                ? 'Loading...' 
                : `${buttonStates[button.actionName]?.payout || 0} ${currency}`}
              title_position={button.position}
              disabled={buttonStates[button.actionName]?.loading}
              error={buttonStates[button.actionName]?.error}
              onClick={() => {
                const action = tradeActions[button.actionName];
                if (action) {
                  action();
                }
              }}
            />
          </Suspense>
        ))}
      </div>
    </div>
  )
}
