import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { useMarketWebSocket } from "@/hooks/websocket";

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

export const App = () => {
  // Initialize market websocket for default instrument
  const { isConnected } = useMarketWebSocket("R_100", {
    onConnect: () => console.log("Market WebSocket Connected"),
    onError: (error) => console.error("Market WebSocket Error:", error),
    onPrice: (price) => console.log("Price Update:", price),
  });

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
