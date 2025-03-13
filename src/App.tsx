import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { useClientStore } from "@/stores/clientStore";
import { ToastProvider } from "@/stores/toastStore";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAccount } from "@/hooks/useAccount";

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
const ContractDetailsPage = lazy(() =>
    import("@/screens/ContractDetailsPage").then((module) => ({
        default: module.ContractDetailsPage,
    }))
);
const MenuPage = lazy(() =>
    import("@/screens/MenuPage").then((module) => ({ default: module.MenuPage }))
);

const LoginPage = lazy(() =>
    import("@/screens/LoginPage").then((module) => ({
        default: module.LoginPage,
    }))
);

const AppContent = () => {
    const { isLoggedIn } = useClientStore();

    // Initialize account data
    useAccount();

    return (
        <MainLayout>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<TradePage />} />
                    <Route path="/trade" element={<TradePage />} />
                    {isLoggedIn ? (
                        <>
                            <Route path="/positions" element={<PositionsPage />} />
                            <Route path="/contract/:id" element={<ContractDetailsPage />} />
                        </>
                    ) : (
                        <Route path="/positions" element={<Navigate to="/menu" />} />
                    )}
                    <Route path="/menu" element={<MenuPage />} />
                    <Route path="/login" element={<LoginPage />} />
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
        const tokenFromUrl = params.get("token");
        const tokenFromStorage = localStorage.getItem("loginToken");

        if (tokenFromUrl) {
            localStorage.setItem("loginToken", tokenFromUrl);
            setToken(tokenFromUrl);

            // Remove token from URL
            params.delete("token");
            const newUrl = params.toString()
                ? `${window.location.pathname}?${params.toString()}`
                : window.location.pathname;
            window.history.replaceState({}, "", newUrl);
        } else if (tokenFromStorage) {
            setToken(tokenFromStorage);
        }

        const loadSmartchartsStyles = () => {
            // @ts-expect-error type seems ok
            import("@deriv-com/smartcharts-champion/dist/smartcharts.css");
        };
        loadSmartchartsStyles();
        setIsInitialized(true);
    }, [setToken]);

    if (!isInitialized) {
        return <div>Initializing...</div>;
    }

    return (
        <BrowserRouter>
            <ThemeProvider />
            <ToastProvider />
            <AppContent />
        </BrowserRouter>
    );
};
