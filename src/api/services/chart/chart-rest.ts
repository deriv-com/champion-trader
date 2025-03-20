import { apiClient } from "@/api/base/rest";
import {
    ActiveSymbolsResponse,
    TradingTimesResponse,
    CandleHistoryRequest,
    TickHistoryRequest,
    RawCandleHistoryResponse,
    RawTickHistoryResponse,
    Candle,
    Tick,
    CandlesResponse,
    HistoryResponse,
    TimeResponse,
    ChartApiRequest,
} from "./types";

/**
 * Fetches active symbols data from the API
 * @returns Promise resolving to active symbols response
 */
export const fetchActiveSymbols = async (): Promise<ActiveSymbolsResponse> => {
    try {
        const response = await apiClient.get<{ data: { instruments: any[] } }>(
            "/v1/market/instruments"
        );

        // Map the API response to match the expected structure
        return {
            active_symbols: response.data.data.instruments.map((instrument: any) => ({
                allow_forward_starting: 0,
                display_name: instrument.display_name,
                exchange_is_open: instrument.is_market_open ? 1 : 0,
                market: instrument.categories?.[0]?.toLowerCase().replace(/\s/g, "_") || "unknown",
                market_display_name: instrument.categories?.[0] || "Unknown",
                pip: instrument.pip_size ? Math.pow(10, -instrument.pip_size) : 0.001,
                symbol: instrument.id,
                symbol_type:
                    instrument.categories?.[1]?.toLowerCase().replace(/\s/g, "_") || "unknown",
                subgroup:
                    instrument.categories?.[1]?.toLowerCase().replace(/\s/g, "_") || "unknown",
                subgroup_display_name: instrument.categories?.[1] || "Unknown",
                submarket:
                    instrument.categories?.[1]?.toLowerCase().replace(/\s/g, "_") || "unknown",
                submarket_display_name: instrument.categories?.[1] || "Unknown",
            })),
            msg_type: "active_symbols",
        };
    } catch (error) {
        console.error("Error fetching active symbols:", error);
        // Return fallback data in case of error
        return {
            active_symbols: [],
            msg_type: "active_symbols",
        };
    }
};

/**
 * Fetches trading times data
 * @returns Promise resolving to trading times response
 */
export const fetchTradingTimes = async (): Promise<TradingTimesResponse> => {
    // Currently returning mock data as the API doesn't provide this endpoint
    // In a real implementation, this would make an API call
    return {
        msg_type: "trading_times",
        markets: [
            {
                name: "Synthetic Indices",
                submarkets: [
                    {
                        name: "Continuous Indices",
                        symbols: [
                            {
                                name: "Volatility 10 Index",
                                symbol: "R_10",
                                times: {
                                    close: ["23:59:59"],
                                    open: ["00:00:00"],
                                    settlement: "23:59:59",
                                },
                                trading_days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                                trading_hours: ["00:00:00-23:59:59"],
                            },
                        ],
                    },
                ],
            },
        ],
    };
};

/**
 * Fetches candle history data from the API
 * @param request Request parameters including instrument_id, granularity, and count
 * @returns Promise resolving to array of candles
 */
export const fetchCandleHistory = async (request: CandleHistoryRequest): Promise<Candle[]> => {
    try {
        const response = await apiClient.post<RawCandleHistoryResponse>(
            "/v1/market/instruments/candles/history",
            request
        );

        // Map the API response to match the expected structure
        return response.data.data.candles.map((candle: any) => ({
            epoch: Math.floor(parseFloat(candle.open_epoch_ms) * 1000), // Convert ms to seconds
            open: parseFloat(candle.open),
            high: parseFloat(candle.high),
            low: parseFloat(candle.low),
            close: parseFloat(candle.close),
        }));
    } catch (error) {
        console.error("Error fetching candle history:", error);
        return [];
    }
};

/**
 * Fetches tick history data from the API
 * @param request Request parameters including instrument_id, from_epoch_ms, to_epoch_ms, granularity, and count
 * @returns Promise resolving to array of ticks
 */
export const fetchTickHistory = async (request: TickHistoryRequest): Promise<Tick[]> => {
    try {
        // Current time in milliseconds if to_epoch_ms is not provided
        const now = Date.now();

        // Calculate from_epoch_ms based on granularity and count if not provided
        const from_epoch_ms =
            request.from_epoch_ms ||
            (request.count && request.granularity
                ? now - request.granularity * request.count * 1000
                : now - 60 * 1000 * 1000); // Default to 1000 minutes ago

        const to_epoch_ms = now;

        // Add account_uuid parameter for the mock API
        const response = await apiClient.post<RawTickHistoryResponse>(
            "/v1/market/instruments/ticks/history?account_uuid=9f8c1b23-4e2a-47ad-92c2-b1e5d2a7e65f",
            {
                instrument_id: request.instrument_id,
                from_epoch_ms,
                to_epoch_ms,
                granularity: request.granularity || 60,
                count: request.count || 1000,
            }
        );

        if (
            !response.data.data ||
            !response.data.data.ticks ||
            !Array.isArray(response.data.data.ticks)
        ) {
            console.error("Invalid tick history data format:", response.data);
            return [];
        }

        // Map the API response to match the expected structure
        return response.data.data.ticks.map((tick: any) => ({
            epoch: Math.floor(parseFloat(tick.epoch_ms) / 1000), // Convert ms to seconds
            quote: parseFloat(tick.price),
        }));
    } catch (error) {
        console.error("Error fetching tick history:", error);
        return [];
    }
};

/**
 * Creates a history response object for ticks or candles
 * @param symbol The symbol to get history for
 * @param request The request parameters
 * @returns Promise resolving to history response
 */
export const createTickHistory = async (
    symbol: string,
    request: any
): Promise<CandlesResponse | HistoryResponse> => {
    const style = request.style || "ticks";

    if (style === "candles" || style === "candle") {
        const granularity = request.granularity || 60; // Default to 1 minute candles
        const count = request.count || 100; // Default to 100 candles

        // Try to fetch real candle data from API
        const candles = await fetchCandleHistory({
            instrument_id: symbol,
            granularity,
            count,
        });

        return {
            echo_req: {
                ticks_history: symbol,
                style: "candles",
                granularity,
                end: "latest",
            },
            candles,
            msg_type: "candles",
            pip_size: 2,
        };
    } else {
        // Fetch tick data from API
        const granularity = request.granularity || 60; // Default to 1 minute granularity
        const count = request.count || 1000; // Default to 1000 ticks

        // Try to fetch real tick data from API
        const ticks = await fetchTickHistory({
            instrument_id: symbol,
            granularity,
            count,
            from_epoch_ms: request.start
                ? request.start < 10000000000
                    ? request.start * 1000
                    : request.start
                : undefined,
            to_epoch_ms: request.end
                ? request.end < 10000000000
                    ? request.end * 1000
                    : request.end
                : undefined,
        });

        return {
            echo_req: {
                ticks_history: symbol,
                style: "ticks",
                end: "latest",
            },
            history: {
                prices: ticks.map((t) => t.quote),
                times: ticks.map((t) => t.epoch),
            },
            msg_type: "history",
            pip_size: 2,
        };
    }
};

/**
 * Handles chart API requests
 * @param request The API request
 * @returns Promise resolving to the appropriate response
 */
export const handleChartApiRequest = async (
    request: ChartApiRequest
): Promise<
    | ActiveSymbolsResponse
    | TradingTimesResponse
    | CandlesResponse
    | HistoryResponse
    | TimeResponse
    | any
> => {
    // Handle time request
    if (request.time) {
        const currentTime = Math.floor(Date.now() / 1000);
        return {
            echo_req: {
                req_id: request.req_id,
                time: request.time,
            },
            req_id: request.req_id,
            time: currentTime,
            msg_type: "time",
        };
    }

    // Handle active_symbols request
    if (request.active_symbols) {
        return fetchActiveSymbols();
    }

    // Handle trading_times request
    if (request.trading_times) {
        return fetchTradingTimes();
    }

    // Handle ticks_history request
    if (request.ticks_history) {
        return createTickHistory(request.ticks_history, request);
    }

    // Handle other requests with empty responses
    return { msg_type: request.msg_type || "unknown" };
};
