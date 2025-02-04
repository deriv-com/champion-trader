import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { useMarketWebSocket } from "@/hooks/websocket";
import { useContractSSE } from "@/hooks/sse";
import { ContractPriceRequest } from "@/services/api/websocket/types";
import { useClientStore } from "@/stores/clientStore";

const TradePage = lazy(() =>
  import("@/screens/TradePage").then((module) => ({
    default: module.TradePage,
  }))
);
const PositionsPage = lazy(() =>
  import("@/screens/PositionsPage").then((module) => ({
    default: module.PositionsPage,
  }))
);
const MenuPage = lazy(() =>
  import("@/screens/MenuPage").then((module) => ({ default: module.MenuPage }))
);

// Initialize contract SSE for default parameters
const contractParams: ContractPriceRequest = {
  duration: "1m",
  instrument: "R_100",
  trade_type: "CALL",
  currency: "USD",
  payout: "100",
  strike: "1234.56",
};

export const App = () => {
  // Initialize market websocket for default instrument
  const { isConnected } = useMarketWebSocket("R_100", {
    onConnect: () => console.log("Market WebSocket Connected"),
    onError: (error) => console.log("Market WebSocket Error:", error),
    onPrice: (price) => console.log("Price Update:", price),
  });

  const { token } = useClientStore();

  const { price } = token
    ? useContractSSE(
        contractParams,
        token,
        {
          onPrice: (price) => console.log("Contract Price Update:", price),
          onError: (error) => console.log("Contract SSE Error:", error),
        }
      )
    : { price: null };

  useEffect(() => {
    if (price) {
      console.log("Contract Price:", price);
    }
  }, [price]);

  // Log connection status changes
  useEffect(() => {
    if (!isConnected) {
      console.log("Market WebSocket Disconnected");
    }
  }, [isConnected]);

  return (
    <BrowserRouter>
      <MainLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<TradePage />} />
            <Route path="/trade" element={<TradePage />} />
            <Route path="/positions" element={<PositionsPage />} />
            <Route path="/menu" element={<MenuPage />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </BrowserRouter>
  );
};
