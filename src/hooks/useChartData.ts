import { useState, useEffect } from 'react';

interface ChartTick {
  type: 'tick';
  instrument_id: string;
  quote: number;
  timestamp: string;
}

interface UseChartDataProps {
  useMockData?: boolean;
  instrumentId?: string;
}

export const useChartData = ({ useMockData = true, instrumentId = '1HZ100V' }: UseChartDataProps = {}) => {
  const [data, setData] = useState<ChartTick>({
    type: 'tick',
    instrument_id: instrumentId,
    quote: 911.73,
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    if (useMockData) {
      // Mock data stream
      const interval = setInterval(() => {
        const change = (Math.random() * 10 - 1) * 0.5;
        setData(prevData => ({
          type: 'tick',
          instrument_id: instrumentId,
          quote: prevData.quote + change,
          timestamp: new Date().toISOString(),
        }));
      }, 1000);

      return () => clearInterval(interval);
    } else {
      // Real API data stream implementation
      // TODO: Implement real WebSocket connection
      // Example:
      // const ws = new WebSocket('your-websocket-url');
      // ws.onmessage = (event) => {
      //   const tickData = JSON.parse(event.data);
      //   setData(tickData);
      // };
      // return () => ws.close();
    }
  }, [useMockData, instrumentId]);

  return data;
};
