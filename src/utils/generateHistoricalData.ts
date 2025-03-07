export const generateHistoricalCandles = (
    count: number = 100,
    durationInSeconds: number = 60,
    instrumentId: string = "frxUSDJPY"
) => {
    const currentTime = Date.now();
    const durationInMs = durationInSeconds * 1000;

    const candles = Array.from({ length: count }, (_, index) => {
        const basePrice = 911.5 + (Math.random() * 10 - 5);
        const timeOffset = (count - 1 - index) * durationInMs;
        const openTime = currentTime - timeOffset;

        return {
            open_epoch_ms: openTime.toString(),
            open: basePrice.toString(),
            high: (basePrice + 2).toString(),
            low: (basePrice - 1.7).toString(),
            close: (basePrice + 0.23).toString(),
            close_epoch_ms: (openTime + durationInMs).toString(),
        };
    });

    return {
        instrument_id: instrumentId,
        candles,
    };
};

export const generateHistoricalTicks = (instrumentId: string = "1HZ100", count: number = 100) => {
    const currentTime = Date.now();
    const ticks = Array.from({ length: count }, (_, index) => {
        const basePrice = 911.5 + (Math.random() * 10 - 5);
        const timeOffset = (count - 1 - index) * 1000; // 1 second intervals

        return {
            epoch_ms: (currentTime - timeOffset).toString(),
            ask: (basePrice + 0.2).toString(),
            bid: (basePrice - 0.2).toString(),
            price: basePrice.toString(),
        };
    });

    return {
        instrument_id: instrumentId,
        ticks,
    };
};
