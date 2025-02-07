import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { useClientStore } from "@/stores/clientStore";
import { ContractSSEHandler } from "@/components/ContractSSEHandler";
import { BalanceHandler } from "@/components/BalanceHandler";
import { NotificationProvider } from "@/components/NotificationProvider";

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

const AppContent = () => {
  const { token, isLoggedIn } = useClientStore();

  return (
    <MainLayout>
      {token && (
        <>
          <ContractSSEHandler token={token} />
          <BalanceHandler token={token} />
        </>
      )}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<TradePage />} />
          <Route path="/trade" element={<TradePage />} />
          {isLoggedIn ? (
            <Route path="/positions" element={<PositionsPage />} />
          ) : (
            <Route path="/positions" element={<Navigate to="/menu" />} />
          )}
          <Route path="/menu" element={<MenuPage />} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
};

export const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { setToken } = useClientStore();

  // Handle login token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    const tokenFromStorage = localStorage.getItem('loginToken');

    if (tokenFromUrl) {
      localStorage.setItem('loginToken', tokenFromUrl);
      setToken(tokenFromUrl);
      
      // Remove token from URL
      params.delete('token');
      const newUrl = params.toString() 
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    } else if (tokenFromStorage) {
      setToken(tokenFromStorage);
    }
    
    setIsInitialized(true);
  }, [setToken]);

  if (!isInitialized) {
    return <div>Initializing...</div>;
  }

  return (
    <NotificationProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </NotificationProvider>
  );
};
