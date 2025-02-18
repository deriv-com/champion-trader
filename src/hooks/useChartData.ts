import { useState, useEffect, useRef } from "react";
import {
  transformCandleData,
  transformTickData,
} from "../utils/transformChartData";

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
  const openTime = useRef(Math.floor(Date.now() / 1000));
  const closeTime = useRef(openTime.current);

  const [data, setData] = useState(() => {
    if (type === "candle") {
      return transformCandleData({
        candles: [
          {
            openEpochMs: openTime.current,
            open: "911.5",
            high: "913.5",
            low: "909.8",
            close: "911.73",
            closeEpochMs: closeTime.current,
          },
        ],
      });
    } else {
      return transformTickData({
        instrumentId,
        ticks: [
          {
            epochMs: Date.now(),
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
      // TODO: Implement real WebSocket connection
      return;
    }

    const interval = setInterval(() => {
      const change = (Math.random() * 10 - 1) * 0.5;
      const basePrice = 911.5 + change;

      if (type === "candle") {
        // Increment closeEpochMs by 1 second
        closeTime.current += 1;

        // Check if closeEpochMs has reached the next candle period
        if (closeTime.current >= openTime.current + durationInSeconds) {
          // Increment openEpochMs by durationInSeconds
          openTime.current += durationInSeconds;
        }

        const candleData = {
          candles: [
            {
              openEpochMs: openTime.current,
              open: basePrice.toString(),
              high: (basePrice + 2).toString(),
              low: (basePrice - 1.7).toString(),
              close: (basePrice + 0.23).toString(),
              closeEpochMs: closeTime.current,
            },
          ],
        };
        setData(transformCandleData(candleData));
      } else {
        const tickData = {
          instrumentId,
          ticks: [
            {
              epochMs: Date.now(),
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
