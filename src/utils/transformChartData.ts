interface CandleData {
  openEpochMs: number;
  open: string;
  high: string;
  low: string;
  close: string;
  closeEpochMs: number;
}

interface TickData {
  epochMs: number;
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
  msg_type: 'candles';
  candles: TransformedCandle[];
}

interface TransformedCandleDataSingle {
  msg_type: 'ohlc';
  ohlc: TransformedCandle;
}

type TransformedCandleData = TransformedCandleDataMultiple | TransformedCandleDataSingle;

interface TransformedTickDataMultiple {
  msg_type: 'history';
  instrumentId: string;
  history: TransformedTick[];
}

interface TransformedTickDataSingle {
  msg_type: 'tick';
  instrumentId: string;
  tick: TransformedTick;
}

type TransformedTickData = TransformedTickDataMultiple | TransformedTickDataSingle;

export const transformCandleData = (data: { candles: CandleData[] }): TransformedCandleData => {
  const { candles } = data;
  const isMultipleCandles = candles.length > 1;

  const transformedCandles = candles.map(candle => ({
    open_time: candle.openEpochMs,
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
    epoch: candle.closeEpochMs
  }));

  if (isMultipleCandles) {
    return {
      msg_type: 'candles',
      candles: transformedCandles
    };
  }

  return {
    msg_type: 'ohlc',
    ohlc: transformedCandles[0]
  };
};

export const transformTickData = (data: { instrumentId: string; ticks: TickData[] }): TransformedTickData => {
  const { instrumentId, ticks } = data;
  const isHistory = ticks.length > 1;

  const transformedTicks = ticks.map(tick => ({
    epoch: Math.floor(tick.epochMs / 1000),
    ask: tick.ask,
    bid: tick.bid,
    quote: tick.price
  }));

  if (isHistory) {
    return {
      msg_type: 'history',
      instrumentId,
      history: transformedTicks
    };
  }

  return {
    msg_type: 'tick',
    instrumentId,
    tick: transformedTicks[0]
  };
};
