import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMarketWebSocket } from "@/hooks/websocket";
import {
  createChart,
  IChartApi,
  UTCTimestamp,
  SingleValueData,
  BaselineSeries,
} from "lightweight-charts";

interface ChartProps {
  className?: string;
}

interface ChartData {
  time: UTCTimestamp;
  value: number;
}

export const Chart: React.FC<ChartProps> = ({ className }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [priceHistory, setPriceHistory] = useState<ChartData[]>([]);

  const { isConnected } = useMarketWebSocket("R_100", {
    onConnect: () => console.log("Market WebSocket Connected in Chart"),
    onError: (err) => console.log("Market WebSocket Error in Chart:", err),
    onPrice: (price) => {
      if (price?.ask) {
        const timestamp = new Date(price.timestamp);
        const newTime = Math.floor(timestamp.getTime() / 1000) as UTCTimestamp;
        const newPrice: ChartData = {
          time: newTime,
          value: price.ask,
        };
        setPriceHistory((prev) => {
          // Filter out any existing data point with the same timestamp
          const filtered = prev.filter(point => point.time !== newTime);
          // Add new price and sort by timestamp
          return [...filtered, newPrice].sort((a, b) => a.time - b.time);
        });
        setCurrentPrice(price.ask);
        setCurrentTime(timestamp.toLocaleString());

        if (seriesRef.current) {
          seriesRef.current.update(newPrice);
        }
      }
    },
  });

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "white" },
        textColor: "black",
      },
      grid: {
        vertLines: { color: "#f0f0f0" },
        horzLines: { color: "#f0f0f0" },
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: true,
      },
      crosshair: {
        vertLine: {
          labelBackgroundColor: "#404040",
        },
        horzLine: {
          labelBackgroundColor: "#404040",
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    const baselineSeries = chart.addSeries(BaselineSeries, {
      // baseValue: { type: "price", price: undefined },
      topLineColor: "rgba( 38, 166, 154, 1)",
      topFillColor1: "rgba( 38, 166, 154, 0.28)",
      topFillColor2: "rgba( 38, 166, 154, 0.05)",
      bottomLineColor: "rgba( 239, 83, 80, 1)",
      bottomFillColor1: "rgba( 239, 83, 80, 0.05)",
      bottomFillColor2: "rgba( 239, 83, 80, 0.28)",
    });

    chartRef.current = chart;
    seriesRef.current = baselineSeries;

    // Subscribe to crosshair move to update the tooltip
    chart.subscribeCrosshairMove((param) => {
      if (param.time) {
        const data = param.seriesData.get(baselineSeries) as SingleValueData;
        if (data?.value) {
          setCurrentPrice(data.value);
          const timestamp = new Date((param.time as number) * 1000);
          setCurrentTime(timestamp.toLocaleString());
        }
      }
    });

    // Handle window resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  // Update data when price history changes
  useEffect(() => {
    if (seriesRef.current && priceHistory.length > 0) {
      // Ensure data is sorted and has unique timestamps before setting
      const uniqueSortedData = priceHistory
        .filter((value, index, self) => 
          self.findIndex(v => v.time === value.time) === index
        )
        .sort((a, b) => a.time - b.time);
      seriesRef.current.setData(uniqueSortedData);
      chartRef.current?.timeScale().fitContent();
    }
  }, [priceHistory]);

  return (
    <div className={cn("flex flex-col flex-1", className)}>
      <div className="flex-1 bg-white w-full rounded-lg relative h-full">
        {currentPrice && currentTime && (
          <div className="absolute top-4 left-4 bg-gray-100 p-2 rounded shadow-sm z-10">
            <div className="text-sm font-medium">VOLATILITY 100 (1S) INDEX</div>
            <div className="text-lg font-bold">{currentPrice.toFixed(2)}</div>
            <div className="text-xs text-gray-600">{currentTime}</div>
          </div>
        )}
        <div
          ref={chartContainerRef}
          className="w-full h-full"
          data-testid="chart-container"
        />
        {!isConnected && (
          <div
            data-testid="ws-disconnected"
            className="text-center text-red-500"
          >
            Disconnected
          </div>
        )}
      </div>
    </div>
  );
};
