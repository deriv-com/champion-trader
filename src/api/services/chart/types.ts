/**
 * Types for chart API requests and responses
 */

/**
 * Active Symbol data structure
 */
export interface ActiveSymbol {
    allow_forward_starting: number;
    display_name: string;
    exchange_is_open: number;
    market: string;
    market_display_name: string;
    pip: number;
    symbol: string;
    symbol_type: string;
    subgroup: string;
    subgroup_display_name: string;
    submarket: string;
    submarket_display_name: string;
}

/**
 * Active Symbols response
 */
export interface ActiveSymbolsResponse {
    active_symbols: ActiveSymbol[];
    msg_type: string;
}

/**
 * Trading Times Symbol data
 */
export interface TradingTimesSymbol {
    name: string;
    symbol: string;
    times: {
        close: string[];
        open: string[];
        settlement: string;
    };
    trading_days: string[];
    trading_hours: string[];
}

/**
 * Trading Times Submarket data
 */
export interface TradingTimesSubmarket {
    name: string;
    symbols: TradingTimesSymbol[];
}

/**
 * Trading Times Market data
 */
export interface TradingTimesMarket {
    name: string;
    submarkets: TradingTimesSubmarket[];
}

/**
 * Trading Times response
 */
export interface TradingTimesResponse {
    msg_type: string;
    markets: TradingTimesMarket[];
}

/**
 * Candle data structure
 */
export interface Candle {
    epoch: number;
    open: number;
    high: number;
    low: number;
    close: number;
}

/**
 * Candles response
 */
export interface CandlesResponse {
    echo_req: {
        ticks_history: string;
        style: string;
        granularity: number;
        end: string;
    };
    candles: Candle[];
    msg_type: string;
    pip_size: number;
}

/**
 * Tick data structure
 */
export interface Tick {
    epoch: number;
    quote: number;
}

/**
 * History response
 */
export interface HistoryResponse {
    echo_req: {
        ticks_history: string;
        style: string;
        end: string;
    };
    history: {
        prices: number[];
        times: number[];
    };
    msg_type: string;
    pip_size: number;
}

/**
 * OHLC update data
 */
export interface OHLCUpdate {
    echo_req: { ticks: string };
    ohlc: {
        open: string;
        high: string;
        low: string;
        close: string;
        open_time: number;
        granularity: number;
        symbol: string;
        id: string;
    };
    msg_type: string;
}

/**
 * Tick update data
 */
export interface TickUpdate {
    echo_req: { ticks: string };
    tick: {
        ask: string;
        bid: string;
        epoch: number;
        id: string;
        pip_size: number;
        quote: string;
        symbol: string;
    };
    msg_type: string;
}

/**
 * Time response
 */
export interface TimeResponse {
    echo_req: {
        req_id: string;
        time: number;
    };
    req_id: string;
    time: number;
    msg_type: string;
}

/**
 * Chart API request types
 */
export interface ChartApiRequest {
    [key: string]: any;
    req_id?: string;
}

/**
 * Ticks history request
 */
export interface TicksHistoryRequest {
    ticks_history: string;
    style?: "ticks" | "candles";
    granularity?: number;
    count?: number;
    start?: number;
    end?: number;
}

/**
 * Candle history request for REST API
 */
export interface CandleHistoryRequest {
    instrument_id: string;
    granularity: number;
    count?: number;
}

/**
 * Tick history request for REST API
 */
export interface TickHistoryRequest {
    instrument_id: string;
    from_epoch_ms?: number;
    to_epoch_ms?: number;
    granularity?: number;
    count?: number;
}

/**
 * Raw candle data from API
 */
export interface RawCandle {
    open_epoch_ms: string;
    open: string;
    high: string;
    low: string;
    close: string;
    close_epoch_ms?: string;
}

/**
 * Raw tick data from API
 */
export interface RawTick {
    epoch_ms: string;
    price: string;
    ask?: string;
    bid?: string;
}

/**
 * Raw candle history response
 */
export interface RawCandleHistoryResponse {
    data: {
        candles: RawCandle[];
    };
}

/**
 * Raw tick history response
 */
export interface RawTickHistoryResponse {
    data: {
        ticks: RawTick[];
    };
}

/**
 * Subscription callback type
 */
export type SubscriptionCallback = (data: OHLCUpdate | TickUpdate) => void;
