import { createSSEConnection } from "@/api/base/sse";
import { OHLCUpdate, TickUpdate, SubscriptionCallback } from "./types";
import { createTickHistory } from "./chart-rest";

// Cache for history data to prevent duplicate API calls
const historyCache = new Map<string, any>();

// Active subscriptions to prevent duplicate streams
const activeSubscriptions = new Map<
    string,
    {
        unsubscribe: () => void;
        callbacks: Set<SubscriptionCallback>;
    }
>();

/**
 * Subscribes to candle data stream for a specific symbol
 * @param symbol The symbol to subscribe to
 * @param granularity The granularity in seconds
 * @param callback The callback function to handle updates
 * @returns A function to unsubscribe from the stream
 */
export const subscribeToCandleStream = (
    symbol: string,
    granularity: number,
    callback: SubscriptionCallback
): (() => void) => {
    const now = Date.now();
    const start_epoch_ms = now - granularity * 1000; // Start from 1 candle ago

    // Create SSE connection for candle data
    return createSSEConnection({
        params: {
            instrument_id: symbol,
            start_epoch_ms: start_epoch_ms.toString(),
            granularity: granularity.toString(),
            account_uuid: "9f8c1b23-4e2a-47ad-92c2-b1e5d2a7e65f",
        },
        customPath: "/v1/market/instruments/candles/stream",
        onMessage: (data) => {
            if (data && data.data && data.data.candles && data.data.candles.length > 0) {
                const candle = data.data.candles[0];
                const now = Math.floor(Date.now());

                // Convert open_epoch_ms to seconds for consistency
                const open_time = Math.floor(parseInt(candle.open_epoch_ms) / 1000);

                // Create an OHLC update from the SSE data
                const newData: OHLCUpdate = {
                    echo_req: { ticks: symbol },
                    ohlc: {
                        open: candle.open,
                        high: candle.high,
                        low: candle.low,
                        close: candle.close,
                        open_time: open_time,
                        granularity: granularity,
                        symbol: symbol,
                        id: `${symbol}_${now}`,
                    },
                    msg_type: "ohlc",
                };

                // Call the callback with the new data
                callback(newData);
            }
        },
        onError: (error) => {
            console.error("SSE candle connection error:", error);
        },
    });
};

/**
 * Subscribes to tick data stream for a specific symbol
 * @param symbol The symbol to subscribe to
 * @param callback The callback function to handle updates
 * @returns A function to unsubscribe from the stream
 */
export const subscribeToTickStream = (
    symbol: string,
    callback: SubscriptionCallback
): (() => void) => {
    // Create SSE connection for tick data
    return createSSEConnection({
        params: {
            instrument_id: symbol,
        },
        customPath: "/v1/market/instruments/ticks/stream",
        onMessage: (data) => {
            if (data && data.data && data.data.ticks && data.data.ticks.length > 0) {
                const tick = data.data.ticks[0];
                const now = Math.floor(Date.now() / 1000);

                // Convert epoch_ms to seconds for consistency
                const epoch = Math.floor(parseInt(tick.epoch_ms) / 1000);

                // Create a tick update from the SSE data
                const newData: TickUpdate = {
                    echo_req: { ticks: symbol },
                    tick: {
                        ask: tick.ask || tick.price,
                        bid: tick.bid || tick.price,
                        epoch: epoch,
                        id: `${symbol}_${now}`,
                        pip_size: 2,
                        quote: tick.price,
                        symbol: symbol,
                    },
                    msg_type: "tick",
                };

                // Call the callback with the new data
                callback(newData);
            }
        },
        onError: (error) => {
            console.error("SSE tick connection error:", error);
        },
    });
};

/**
 * Handles chart subscription requests
 * @param request The subscription request
 * @param callback The callback function to handle updates
 * @returns A function to unsubscribe from the stream
 */
export const handleChartSubscribe = (
    request: any,
    callback: SubscriptionCallback
): (() => void) => {
    // Get the symbol from the request
    const symbol = request.ticks || request.ticks_history || request.candles || "R_100";
    const style = request.style || "ticks";
    const granularity = request.granularity || 0;

    // Create a cache key based on the request parameters
    const cacheKey = `${symbol}_${style}_${granularity}_${JSON.stringify(request.count || 0)}_${JSON.stringify(request.start || 0)}_${JSON.stringify(request.end || 0)}`;

    // Check if we already have an active subscription for this request
    if (activeSubscriptions.has(cacheKey)) {
        const subscription = activeSubscriptions.get(cacheKey)!;

        // If we have cached history data, send it immediately
        if (historyCache.has(cacheKey)) {
            callback(historyCache.get(cacheKey));
        }

        // Add this callback to the set of callbacks for this subscription
        subscription.callbacks.add(callback);

        // Return a function to remove this callback from the subscription
        return () => {
            const subscription = activeSubscriptions.get(cacheKey);
            if (subscription) {
                subscription.callbacks.delete(callback);

                // If there are no more callbacks, unsubscribe and remove from active subscriptions
                if (subscription.callbacks.size === 0) {
                    subscription.unsubscribe();
                    activeSubscriptions.delete(cacheKey);
                }
            }
        };
    }

    // Create a new set of callbacks for this subscription
    const callbacks = new Set<SubscriptionCallback>([callback]);

    // Function to broadcast data to all callbacks
    const broadcastData = (data: any) => {
        callbacks.forEach((cb) => cb(data));
    };

    // Create a variable to store the unsubscribe function
    let unsubscribeStream: (() => void) | null = null;

    // First check if we have cached history data
    if (historyCache.has(cacheKey)) {
        const historyData = historyCache.get(cacheKey);

        // Send the cached history data to the callback
        callback(historyData);

        // Set up the streaming connection
        if (style === "candles" || style === "candle") {
            try {
                unsubscribeStream = subscribeToCandleStream(symbol, granularity, callback);
            } catch (error) {
                console.error(`Error setting up candle stream for ${symbol}:`, error);
            }
        } else {
            unsubscribeStream = subscribeToTickStream(symbol, broadcastData);
        }
    } else {
        // If we don't have cached data, fetch it
        createTickHistory(symbol, request)
            .then((historyData) => {
                // Cache the history data
                historyCache.set(cacheKey, historyData);

                // Send the history data to the callback
                broadcastData(historyData as any);

                // Now set up the streaming connection
                if (style === "candles" || style === "candle") {
                    try {
                        unsubscribeStream = subscribeToCandleStream(
                            symbol,
                            granularity,
                            broadcastData
                        );
                    } catch (error) {
                        console.error(`Error setting up candle stream for ${symbol}:`, error);
                    }
                } else {
                    unsubscribeStream = subscribeToTickStream(symbol, broadcastData);
                }
            })
            .catch((error) => {
                console.error("Error in chart subscription:", error);
                // Provide a fallback response in case of error
                const fallbackData = {
                    msg_type: style === "candles" ? "candles" : "history",
                    echo_req: { ticks: symbol },
                    pip_size: 2,
                };
                broadcastData(fallbackData as any);
            });
    }

    // Store the subscription in the active subscriptions map
    activeSubscriptions.set(cacheKey, {
        unsubscribe: () => {
            if (unsubscribeStream) {
                unsubscribeStream();
                unsubscribeStream = null;
            }
        },
        callbacks,
    });

    // Return a function to unsubscribe this callback
    return () => {
        const subscription = activeSubscriptions.get(cacheKey);
        if (subscription) {
            subscription.callbacks.delete(callback);

            // If there are no more callbacks, unsubscribe and remove from active subscriptions
            if (subscription.callbacks.size === 0) {
                subscription.unsubscribe();
                activeSubscriptions.delete(cacheKey);
            }
        }
    };
};

/**
 * Handles chart forget requests
 * @param request The forget request
 * @returns Promise resolving to forget response
 */
export const handleChartForget = async (request: any): Promise<{ msg_type: string }> => {
    // The actual unsubscription is handled by the returned function from handleChartSubscribe
    // This function is just for compatibility with the existing API
    return { msg_type: "forget" };
};

/**
 * Handles chart forget stream requests
 * @returns Promise resolving to forget_all response
 */
export const handleChartForgetStream = async (): Promise<{ msg_type: string }> => {
    // The actual unsubscription is handled by the returned function from handleChartSubscribe
    // This function is just for compatibility with the existing API
    return { msg_type: "forget_all" };
};
