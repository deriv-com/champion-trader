import React, { Suspense, lazy, useEffect, useState } from "react"
import { ServerTime } from "@/components/ServerTime"
import { TradeButton } from "@/components/TradeButton"
import { ResponsiveTradeParamLayout } from "@/components/ui/responsive-trade-param-layout"
import { MobileTradeFieldCard } from "@/components/ui/mobile-trade-field-card"
import { DesktopTradeFieldCard } from "@/components/ui/desktop-trade-field-card"
import { useTradeStore } from "@/stores/tradeStore"
import { tradeTypeConfigs } from "@/config/tradeTypes"
import { useTradeActions } from "@/hooks/useTradeActions"
import { parseDuration, formatDuration } from "@/utils/duration"
import { createSSEConnection } from "@/services/api/sse/createSSEConnection"
import { useClientStore } from "@/stores/clientStore"
import { WebSocketError } from "@/services/api/websocket/types"
import { HowToTrade } from "@/components/HowToTrade"
import { PayoutDisplay } from "@/components/Stake/components/PayoutDisplay"

// Lazy load components
const DurationField = lazy(() =>
  import("@/components/Duration").then((module) => ({
    default: module.DurationField,
  }))
)

const StakeField = lazy(() =>
  import("@/components/Stake").then((module) => ({
    default: module.StakeField,
  }))
)

const EqualTradeController = lazy(() =>
  import("@/components/EqualTrade").then((module) => ({
    default: module.EqualTradeController,
  }))
)

interface TradeFormControllerProps {
  isLandscape: boolean
}

interface ButtonState {
  loading: boolean
  error: Event | WebSocketError | null
  payout: number
  reconnecting?: boolean
}

type ButtonStates = Record<string, ButtonState>

export const TradeFormController: React.FC<TradeFormControllerProps> = ({
  isLandscape,
}) => {
  const { trade_type, duration, setPayouts, stake } = useTradeStore()
  const { token, currency } = useClientStore()
  const tradeActions = useTradeActions()
  const config = tradeTypeConfigs[trade_type]
  const [isStakeSelected, setIsStakeSelected] = useState(false)
  const [stakeError, setStakeError] = useState(false)

  const [buttonStates, setButtonStates] = useState<ButtonStates>(() => {
    // Initialize states for all buttons in the current trade type
    const initialStates: ButtonStates = {}
    tradeTypeConfigs[trade_type].buttons.forEach((button) => {
      initialStates[button.actionName] = {
        loading: true,
        error: null,
        payout: 0,
        reconnecting: false,
      }
    })
    return initialStates
  })

  // Parse duration for API call
  const { value: apiDurationValue, type: apiDurationType } =
    parseDuration(duration)

  useEffect(() => {
    // Create SSE connections for each button's contract type
    const cleanupFunctions = tradeTypeConfigs[trade_type].buttons.map(
      (button) => {
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
            }))

            // Update payouts in store
            const payoutValue = Number(priceData.price)

            // Create a map of button action names to their payout values
            const payoutValues = Object.keys(buttonStates).reduce(
              (acc, key) => {
                acc[key] =
                  key === button.actionName
                    ? payoutValue
                    : buttonStates[key]?.payout || 0
                return acc
              },
              {} as Record<string, number>
            )

            setPayouts({
              max: 50000,
              values: payoutValues,
            })
          },
          onError: (error) => {
            // Update only this button's state on error
            setButtonStates((prev) => ({
              ...prev,
              [button.actionName]: {
                ...prev[button.actionName],
                loading: false,
                error,
                reconnecting: true,
              },
            }))
          },
          onOpen: () => {
            // Reset error and reconnecting state on successful connection
            setButtonStates((prev) => ({
              ...prev,
              [button.actionName]: {
                ...prev[button.actionName],
                error: null,
                reconnecting: false,
              },
            }))
          },
        })
      }
    )

    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup())
    }
  }, [duration, stake, currency, token])

  // Reset loading states when duration or trade type changes
  useEffect(() => {
    const initialStates: ButtonStates = {}
    tradeTypeConfigs[trade_type].buttons.forEach((button) => {
      initialStates[button.actionName] = {
        loading: true,
        error: null,
        payout: buttonStates[button.actionName]?.payout || 0,
        reconnecting: false,
      }
    })
    setButtonStates(initialStates)
  }, [duration, trade_type, stake])

  // Preload components based on metadata
  useEffect(() => {
    if (config.metadata?.preloadFields) {
      // Preload field components
      if (config.fields.duration) {
        import("@/components/Duration")
      }
      if (config.fields.stake) {
        import("@/components/Stake")
      }
      if (config.fields.allowEquals) {
        import("@/components/EqualTrade")
      }
    }
  }, [trade_type, config])

  return (
    <div
      id="trade-section"
      className={`${
        isLandscape
          ? "w-[30%] max-w-[272px] flex flex-col justify-start px-4 py-2 "
          : ""
      }`}
    >
      <div
        className={isLandscape ? "py-2" : "pt-1 px-4"}
        id="how-to-trade"
      >
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
              })
              document.dispatchEvent(event)
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
                    {isStakeSelected && (
                      <div className="p-2">
                        <PayoutDisplay
                          hasError={Boolean(stake && parseFloat(stake) > 50000)}
                          loading={Object.values(buttonStates).some(
                            (state) => state.loading
                          )}
                          loadingStates={Object.keys(buttonStates).reduce(
                            (acc, key) => ({
                              ...acc,
                              [key]: buttonStates[key].loading,
                            }),
                            {}
                          )}
                          maxPayout={50000}
                          payoutValues={Object.keys(buttonStates).reduce(
                            (acc, key) => ({
                              ...acc,
                              [key]: buttonStates[key].payout,
                            }),
                            {}
                          )}
                        />
                      </div>
                    )}
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
                          buttonStates[button.actionName]?.payout || 0
                        } ${currency}`
                  }
                  title_position={button.position}
                  disabled={
                    buttonStates[button.actionName]?.loading ||
                    buttonStates[button.actionName]?.error !== null
                  }
                  loading={
                    buttonStates[button.actionName]?.loading ||
                    buttonStates[button.actionName]?.reconnecting
                  }
                  error={buttonStates[button.actionName]?.error}
                  onClick={() => {
                    const action = tradeActions[button.actionName]
                    if (action) {
                      action()
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
            <div className="p-4">
              <ResponsiveTradeParamLayout>
                {config.fields.duration && (
                  <Suspense fallback={<div>Loading duration field...</div>}>
                    <MobileTradeFieldCard
                      onClick={() => {
                        const durationField = document.querySelector(
                          'button[aria-label^="Duration"]'
                        )
                        if (durationField) {
                          ;(durationField as HTMLButtonElement).click()
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
                        )
                        if (stakeField) {
                          ;(stakeField as HTMLButtonElement).click()
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
                          buttonStates[button.actionName]?.payout || 0
                        } ${currency}`
                  }
                  title_position={button.position}
                  disabled={
                    buttonStates[button.actionName]?.loading ||
                    buttonStates[button.actionName]?.error !== null
                  }
                  loading={
                    buttonStates[button.actionName]?.loading ||
                    buttonStates[button.actionName]?.reconnecting
                  }
                  error={buttonStates[button.actionName]?.error}
                  onClick={() => {
                    const action = tradeActions[button.actionName]
                    if (action) {
                      action()
                    }
                  }}
                />
              </Suspense>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
