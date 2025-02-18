export const generateHistoricalCandles = (count: number = 100, durationInSeconds: number = 60) => {
  const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
  const candles = Array.from({ length: count }, (_, index) => {
    const basePrice = 911.5 + (Math.random() * 10 - 5);
    const timeOffset = (count - 1 - index) * durationInSeconds;
    const openTime = currentTime - timeOffset;
    
    return {
      openEpochMs: openTime,
      open: basePrice.toString(),
      high: (basePrice + 2).toString(),
      low: (basePrice - 1.7).toString(),
      close: (basePrice + 0.23).toString(),
      closeEpochMs: openTime + durationInSeconds
    };
  });

  return {
    candles
  };
};

export const generateHistoricalTicks = (instrumentId: string = '1HZ100', count: number = 100) => {
  const currentTime = Date.now();
  const ticks = Array.from({ length: count }, (_, index) => {
    const basePrice = 911.5 + (Math.random() * 10 - 5);
    const timeOffset = (count - 1 - index) * 1000; // 1 second intervals
    
    return {
      epochMs: (currentTime - timeOffset),
      ask: (basePrice + 0.2).toString(),
      bid: (basePrice - 0.2).toString(),
      price: basePrice.toString()
    };
  });

  return {
    instrumentId,
    ticks
  };
};
