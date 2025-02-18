import React, { useRef, useState, useEffect } from "react";
import { SmartChart } from "./SmartChart";
import { useChartData } from "@/hooks/useChartData";
import { useThemeStore } from "@/stores/themeStore";

export const TradeChart: React.FC = () => {
  const ref = useRef<{
    hasPredictionIndicators(): void;
    triggerPopup(arg: () => void): void;
  }>(null);

  const streamingData = useChartData({ useMockData: true });

  const response = {
    msg_type: "candles",
    candles: [
      {
        close: 911.73,
        timestamp: "2025-02-08T10:03:00Z",
        high: 912.75,
        low: 910.75,
        open: 912.49,
      },
      {
        close: 911.65,
        timestamp: "2025-02-08T10:04:00Z",
        high: 912.57,
        low: 911.36,
        open: 911.76,
      },
      {
        close: 911.03,
        timestamp: "2025-02-08T10:05:00Z",
        high: 913.06,
        low: 910.75,
        open: 911.82,
      },
      {
        close: 912.72,
        timestamp: "2025-02-08T10:06:00Z",
        high: 912.72,
        low: 911.0,
        open: 911.0,
      },
      {
        close: 913.11,
        timestamp: "2025-02-08T10:07:00Z",
        high: 913.36,
        low: 912.34,
        open: 912.9,
      },
      {
        close: 912.48,
        timestamp: "2025-02-08T10:08:00Z",
        high: 913.51,
        low: 912.16,
        open: 912.86,
      },
      {
        close: 912.11,
        timestamp: "2025-02-08T10:09:00Z",
        high: 913.82,
        low: 912.11,
        open: 912.63,
      },
      {
        close: 914.52,
        timestamp: "2025-02-08T10:10:00Z",
        high: 914.52,
        low: 912.3,
        open: 912.31,
      },
      {
        close: 916.45,
        timestamp: "2025-02-08T10:11:00Z",
        high: 916.51,
        low: 913.6,
        open: 914.59,
      },
      {
        close: 915.36,
        timestamp: "2025-02-08T10:12:00Z",
        high: 916.28,
        low: 913.77,
        open: 916.28,
      },
      {
        close: 915.48,
        timestamp: "2025-02-08T10:13:00Z",
        high: 916.22,
        low: 914.66,
        open: 915.47,
      },
      {
        close: 914.29,
        timestamp: "2025-02-08T10:14:00Z",
        high: 915.41,
        low: 914.0,
        open: 915.35,
      },
      {
        close: 915.19,
        timestamp: "2025-02-08T10:15:00Z",
        high: 916.68,
        low: 914.27,
        open: 914.64,
      },
      {
        close: 914.85,
        timestamp: "2025-02-08T10:16:00Z",
        high: 915.9,
        low: 914.4,
        open: 915.23,
      },
      {
        close: 915.92,
        timestamp: "2025-02-08T10:17:00Z",
        high: 916.41,
        low: 914.37,
        open: 915.1,
      },
      {
        close: 916.29,
        timestamp: "2025-02-08T10:18:00Z",
        high: 916.46,
        low: 915.47,
        open: 916.24,
      },
      {
        close: 918.86,
        timestamp: "2025-02-08T10:19:00Z",
        high: 918.95,
        low: 915.78,
        open: 916.08,
      },
      {
        close: 919.56,
        timestamp: "2025-02-08T10:20:00Z",
        high: 919.59,
        low: 918.4,
        open: 918.99,
      },
      {
        close: 922.13,
        timestamp: "2025-02-08T10:21:00Z",
        high: 922.13,
        low: 919.05,
        open: 919.63,
      },
      {
        close: 920.94,
        timestamp: "2025-02-08T10:22:00Z",
        high: 922.38,
        low: 920.53,
        open: 921.98,
      },
      {
        close: 919.57,
        timestamp: "2025-02-08T10:23:00Z",
        high: 921.09,
        low: 918.95,
        open: 920.77,
      },
      {
        close: 918.83,
        timestamp: "2025-02-08T10:24:00Z",
        high: 919.74,
        low: 918.22,
        open: 919.74,
      },
      {
        close: 917.91,
        timestamp: "2025-02-08T10:25:00Z",
        high: 919.81,
        low: 917.83,
        open: 918.99,
      },
      {
        close: 915.75,
        timestamp: "2025-02-08T10:26:00Z",
        high: 918.01,
        low: 915.04,
        open: 918.01,
      },
      {
        close: 915.21,
        timestamp: "2025-02-08T10:27:00Z",
        high: 915.91,
        low: 914.79,
        open: 915.82,
      },
      {
        close: 915.41,
        timestamp: "2025-02-08T10:28:00Z",
        high: 915.82,
        low: 914.48,
        open: 914.91,
      },
      {
        close: 914.37,
        timestamp: "2025-02-08T10:29:00Z",
        high: 915.9,
        low: 914.34,
        open: 915.28,
      },
      {
        close: 912.82,
        timestamp: "2025-02-08T10:30:00Z",
        high: 914.91,
        low: 912.52,
        open: 914.63,
      },
      {
        close: 913.92,
        timestamp: "2025-02-08T10:31:00Z",
        high: 914.1,
        low: 912.67,
        open: 912.92,
      },
      {
        close: 914.91,
        timestamp: "2025-02-08T10:32:00Z",
        high: 916.15,
        low: 913.91,
        open: 914.02,
      },
      {
        close: 914.25,
        timestamp: "2025-02-08T10:33:00Z",
        high: 915.39,
        low: 913.93,
        open: 915.0,
      },
      {
        close: 914.3,
        timestamp: "2025-02-08T10:34:00Z",
        high: 914.55,
        low: 913.34,
        open: 914.25,
      },
      {
        close: 914.46,
        timestamp: "2025-02-08T10:35:00Z",
        high: 914.91,
        low: 914.06,
        open: 914.61,
      },
      {
        close: 915.22,
        timestamp: "2025-02-08T10:36:00Z",
        high: 915.71,
        low: 914.27,
        open: 914.27,
      },
      {
        close: 914.73,
        timestamp: "2025-02-08T10:37:00Z",
        high: 916.05,
        low: 914.64,
        open: 915.1,
      },
      {
        close: 917.48,
        timestamp: "2025-02-08T10:38:00Z",
        high: 917.6,
        low: 914.33,
        open: 914.99,
      },
      {
        close: 918.26,
        timestamp: "2025-02-08T10:39:00Z",
        high: 918.57,
        low: 916.76,
        open: 917.18,
      },
      {
        close: 918.45,
        timestamp: "2025-02-08T10:40:00Z",
        high: 919.1,
        low: 917.99,
        open: 918.44,
      },
      {
        close: 918.62,
        timestamp: "2025-02-08T10:41:00Z",
        high: 918.77,
        low: 917.94,
        open: 918.48,
      },
      {
        close: 918.39,
        timestamp: "2025-02-08T10:42:00Z",
        high: 918.52,
        low: 917.58,
        open: 918.52,
      },
      {
        close: 918.69,
        timestamp: "2025-02-08T10:43:00Z",
        high: 919.69,
        low: 917.64,
        open: 918.25,
      },
      {
        close: 917.95,
        timestamp: "2025-02-08T10:44:00Z",
        high: 919.41,
        low: 917.46,
        open: 918.76,
      },
      {
        close: 919.66,
        timestamp: "2025-02-08T10:45:00Z",
        high: 920.46,
        low: 917.77,
        open: 918.19,
      },
      {
        close: 919.47,
        timestamp: "2025-02-08T10:46:00Z",
        high: 920.37,
        low: 919.18,
        open: 919.91,
      },
      {
        close: 917.94,
        timestamp: "2025-02-08T10:47:00Z",
        high: 919.93,
        low: 917.48,
        open: 919.86,
      },
      {
        close: 918.03,
        timestamp: "2025-02-08T10:48:00Z",
        high: 918.42,
        low: 917.5,
        open: 917.95,
      },
      {
        close: 918.58,
        timestamp: "2025-02-08T10:49:00Z",
        high: 918.96,
        low: 917.0,
        open: 917.99,
      },
      {
        close: 918.4,
        timestamp: "2025-02-08T10:50:00Z",
        high: 919.4,
        low: 918.25,
        open: 918.54,
      },
      {
        close: 919.2,
        timestamp: "2025-02-08T10:51:00Z",
        high: 919.92,
        low: 918.28,
        open: 918.49,
      },
      {
        close: 920.03,
        timestamp: "2025-02-08T10:52:00Z",
        high: 920.03,
        low: 918.41,
        open: 918.86,
      },
      {
        close: 921.27,
        timestamp: "2025-02-08T10:53:00Z",
        high: 921.65,
        low: 920.43,
        open: 920.43,
      },
      {
        close: 924.29,
        timestamp: "2025-02-08T10:54:00Z",
        high: 924.33,
        low: 921.36,
        open: 921.39,
      },
      {
        close: 921.84,
        timestamp: "2025-02-08T10:55:00Z",
        high: 924.16,
        low: 921.59,
        open: 924.16,
      },
      {
        close: 921.73,
        timestamp: "2025-02-08T10:56:00Z",
        high: 923.33,
        low: 921.47,
        open: 921.89,
      },
      {
        close: 923.34,
        timestamp: "2025-02-08T10:57:00Z",
        high: 923.34,
        low: 921.29,
        open: 921.77,
      },
      {
        close: 923.19,
        timestamp: "2025-02-08T10:58:00Z",
        high: 924.74,
        low: 922.8,
        open: 923.27,
      },
      {
        close: 922.74,
        timestamp: "2025-02-08T10:59:00Z",
        high: 923.63,
        low: 922.44,
        open: 922.98,
      },
      {
        close: 922.14,
        timestamp: "2025-02-08T11:00:00Z",
        high: 922.72,
        low: 921.91,
        open: 922.69,
      },
      {
        close: 922.41,
        timestamp: "2025-02-08T11:01:00Z",
        high: 922.75,
        low: 921.5,
        open: 922.12,
      },
      {
        close: 923.26,
        timestamp: "2025-02-08T11:02:00Z",
        high: 923.59,
        low: 922.38,
        open: 922.38,
      },
      {
        close: 923.63,
        timestamp: "2025-02-08T11:03:00Z",
        high: 924.48,
        low: 923.06,
        open: 923.19,
      },
      {
        close: 923.62,
        timestamp: "2025-02-08T11:04:00Z",
        high: 923.76,
        low: 922.59,
        open: 923.76,
      },
      {
        close: 923.94,
        timestamp: "2025-02-08T11:05:00Z",
        high: 925.21,
        low: 923.6,
        open: 923.6,
      },
      {
        close: 924.26,
        timestamp: "2025-02-08T11:06:00Z",
        high: 924.59,
        low: 923.19,
        open: 923.79,
      },
      {
        close: 926.36,
        timestamp: "2025-02-08T11:07:00Z",
        high: 926.4,
        low: 923.74,
        open: 924.11,
      },
      {
        close: 924.93,
        timestamp: "2025-02-08T11:08:00Z",
        high: 926.63,
        low: 924.77,
        open: 926.38,
      },
      {
        close: 928.41,
        timestamp: "2025-02-08T11:09:00Z",
        high: 928.55,
        low: 925.04,
        open: 925.04,
      },
      {
        close: 927.24,
        timestamp: "2025-02-08T11:10:00Z",
        high: 928.75,
        low: 926.91,
        open: 928.61,
      },
      {
        close: 927.09,
        timestamp: "2025-02-08T11:11:00Z",
        high: 927.4,
        low: 926.47,
        open: 927.25,
      },
      {
        close: 926.45,
        timestamp: "2025-02-08T11:12:00Z",
        high: 927.44,
        low: 926.2,
        open: 927.1,
      },
    ],
    echo_req: {
      adjust_start_time: 1,
      count: 1000,
      end: "latest",
      granularity: 60,
      req_id: 41,
      style: "candles",
      subscribe: 1,
      ticks_history: "1HZ100V",
    },
    pip_size: 2,
    req_id: 41,
    subscription: {
      id: "adda2cb9-61de-6320-ab29-5136e904da38",
    },
  };

  // if (symbols.length == 0) return null
  const { isDarkMode } = useThemeStore();
  const [theme, setTheme] = useState<string>("dark");
  useEffect(() => {
    localStorage.setItem("isDarkMode", String(isDarkMode));
    document.documentElement.classList.toggle("dark", isDarkMode);
    setTheme(isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <div style={{ display: "flex", height: "100%", position: "relative" }}>
      <SmartChart
        key={theme}
        settings={{
          theme
        }}
        ref={ref}
        // id="charts"
        barriers={[]}
        chartStatusListener={(isChartReady: boolean) => {}}
        crosshair={0}
        isLive
        chartControlsWidgets={null}
        requestSubscribe={() => {}}
        toolbarWidget={() => <></>}
        symbol={"R_10"}
        topWidgets={() => <div />}
        enabledNavigationWidget={false}
        requestForget={() => {}}
        requestForgetStream={() => {}}
        enabledChartFooter={false}
        granularity={120}
        isVerticalScrollEnabled
        // isConnectionOpened={wsRef.current?.OPEN}
        isConnectionOpened
        clearChart={false}
        shouldFetchTradingTimes={false}
        allowTickChartTypeOnly={false}
        feedCall={{
          activeSymbols: false,
        }}
        isMobile={false}
        yAxisMargin={{
          top: 76,
        }}
        leftMargin={80}
        chartType="candles"
        ticksHistory={response}
        streamingData={streamingData}
      />
      </div>
  );
};
