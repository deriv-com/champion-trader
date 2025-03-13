import { useState, useEffect, useRef } from "react";
import { transformCandleData, transformTickData } from "../utils/transformChartData";

type ChartDataType = "candle" | "tick";

interface UseChartDataProps {
    useMockData?: boolean;
    instrumentId?: string;
    type?: ChartDataType;
    durationInSeconds?: number;
}

export const useChartData = ({
    useMockData = true,
    instrumentId = "1HZ100V",
    type = "tick",
    durationInSeconds = 60,
}: UseChartDataProps = {}) => {
    const openTime = useRef(Date.now());
    const closeTime = useRef(openTime.current);

    const [data, setData] = useState(() => {
        if (type === "candle") {
            return transformCandleData({
                instrument_id: instrumentId,
                candles: [
                    {
                        open_epoch_ms: openTime.current.toString(),
                        open: "911.5",
                        high: "913.5",
                        low: "909.8",
                        close: "911.73",
                        close_epoch_ms: closeTime.current.toString(),
                    },
                ],
            });
        } else {
            return transformTickData({
                instrument_id: instrumentId,
                ticks: [
                    {
                        epoch_ms: Date.now().toString(),
                        ask: "911.5",
                        bid: "911.3",
                        price: "911.4",
                    },
                ],
            });
        }
    });

    useEffect(() => {
        if (!useMockData) {
            // Real API data stream implementation
            // TODO: Implement real connection
            return;
        }

        const interval = setInterval(() => {
            const change = (Math.random() * 10 - 1) * 0.5;
            const basePrice = 911.5 + change;

            if (type === "candle") {
                // Increment close_epoch_ms by 1 second in milliseconds
                closeTime.current += 1000;

                // Check if close_epoch_ms has reached the next candle period
                if (closeTime.current >= openTime.current + durationInSeconds * 1000) {
                    // Increment open_epoch_ms by durationInSeconds in milliseconds
                    openTime.current += durationInSeconds * 1000;
                }

                const candleData = {
                    instrument_id: instrumentId,
                    candles: [
                        {
                            open_epoch_ms: openTime.current.toString(),
                            open: basePrice.toString(),
                            high: (basePrice + 2).toString(),
                            low: (basePrice - 1.7).toString(),
                            close: (basePrice + 0.23).toString(),
                            close_epoch_ms: closeTime.current.toString(),
                        },
                    ],
                };
                setData(transformCandleData(candleData));
            } else {
                const tickData = {
                    instrument_id: instrumentId,
                    ticks: [
                        {
                            epoch_ms: Date.now().toString(),
                            ask: (basePrice + 0.2).toString(),
                            bid: (basePrice - 0.2).toString(),
                            price: basePrice.toString(),
                        },
                    ],
                };
                setData(transformTickData(tickData));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [useMockData, instrumentId, type, durationInSeconds]);

    return data;
};
