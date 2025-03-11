interface CandleData {
    open_epoch_ms: string;
    open: string;
    high: string;
    low: string;
    close: string;
    close_epoch_ms: string;
}

interface TickData {
    epoch_ms: string;
    ask: string;
    bid: string;
    price: string;
}

interface TransformedCandle {
    open_time: number;
    open: string;
    high: string;
    low: string;
    close: string;
    epoch: number;
}

interface TransformedTick {
    epoch: number;
    ask: string;
    bid: string;
    quote: string;
}

interface TransformedCandleDataMultiple {
    msg_type: "candles";
    candles: TransformedCandle[];
    instrument_id: string;
}

interface TransformedCandleDataSingle {
    msg_type: "ohlc";
    ohlc: TransformedCandle;
    instrument_id: string;
}

type TransformedCandleData = TransformedCandleDataMultiple | TransformedCandleDataSingle;

interface TransformedTickDataMultiple {
    msg_type: "history";
    instrument_id: string;
    history: TransformedTick[];
}

interface TransformedTickDataSingle {
    msg_type: "tick";
    instrument_id: string;
    tick: TransformedTick;
}

type TransformedTickData = TransformedTickDataMultiple | TransformedTickDataSingle;

export const transformCandleData = (data: {
    candles: CandleData[];
    instrument_id: string;
}): TransformedCandleData => {
    const { candles, instrument_id } = data;
    const isMultipleCandles = candles.length > 1;

    const transformedCandles = candles.map((candle) => ({
        open_time: Math.floor(parseInt(candle.open_epoch_ms) / 1000),
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        epoch: Math.floor(parseInt(candle.close_epoch_ms) / 1000),
    }));

    if (isMultipleCandles) {
        return {
            msg_type: "candles",
            instrument_id,
            candles: transformedCandles,
        };
    }

    return {
        msg_type: "ohlc",
        instrument_id,
        ohlc: transformedCandles[0],
    };
};

export const transformTickData = (data: {
    instrument_id: string;
    ticks: TickData[];
}): TransformedTickData => {
    const { instrument_id, ticks } = data;
    const isHistory = ticks.length > 1;

    const transformedTicks = ticks.map((tick) => ({
        epoch: Math.floor(parseInt(tick.epoch_ms) / 1000),
        ask: tick.ask,
        bid: tick.bid,
        quote: tick.price,
    }));

    if (isHistory) {
        return {
            msg_type: "history",
            instrument_id,
            history: transformedTicks,
        };
    }

    return {
        msg_type: "tick",
        instrument_id,
        tick: transformedTicks[0],
    };
};
