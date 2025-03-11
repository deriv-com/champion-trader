import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHeaderStore } from "@/stores/headerStore";
import { useBottomNavStore } from "@/stores/bottomNavStore";
import { useContractDetailsStream } from "@/hooks/useContractDetailsStream";
import { useContractDetailsRest } from "@/hooks/useContractDetailsRest";
import { useTradeStore } from "@/stores/tradeStore";
import DesktopContractDetailsPage from "./DesktopContractDetailsPage";
import { ContractDetailsChart } from "@/components/ContractDetailsChart";
import { Header, OrderDetails, EntryExitDetails } from "./components";
import { ContractCard } from "@/components/ContractCard";
import { useOrientationStore } from "@/stores/orientationStore";

const MobileContractDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const setHeaderVisible = useHeaderStore((state) => state.setIsVisible);
    const setBottomNavVisible = useBottomNavStore((state) => state.setIsVisible);
    const { loading: streamLoading, error: streamError } = useContractDetailsStream(id);
    const { loading: fallbackLoading, error: fallbackError } = useContractDetailsRest(id);
    const contractDetails = useTradeStore((state) => state.contractDetails);

    // Combine loading and error states from both hooks
    const loading = streamLoading || fallbackLoading;
    const error = streamError || fallbackError;

    useEffect(() => {
        setHeaderVisible(false);
        setBottomNavVisible(false);
        return () => {
            setHeaderVisible(true);
            setBottomNavVisible(true);
        };
    }, [setHeaderVisible, setBottomNavVisible]);

    // Show loading state
    if (loading && !contractDetails) {
        return (
            <div className="w-full bg-gray-100 h-screen flex flex-col items-center justify-center">
                <div className="text-center">
                    <p>Loading contract details...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error && !contractDetails) {
        return (
            <div className="w-full bg-gray-100 h-screen flex flex-col items-center justify-center">
                <div className="text-center text-red-500">
                    <p>{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 text-white bg-black px-4 py-2 rounded-xl"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-gray-100 h-screen flex flex-col">
            <Header />
            <div className="flex-1 overflow-y-auto w-full lg:w-3/5 mx-auto">
                <div className="p-2 pb-[72px]">
                    {contractDetails && (
                        <ContractCard contract={contractDetails} variant="mobile" />
                    )}
                    <div className="min-h-[400px] mt-4 bg-white rounded-lg border-b border-gray-300">
                        <ContractDetailsChart />
                    </div>
                    <OrderDetails />
                    <EntryExitDetails />
                </div>
            </div>
        </div>
    );
};

const ContractDetailsPage: React.FC = () => {
    const { isLandscape } = useOrientationStore();
    return isLandscape ? <DesktopContractDetailsPage /> : <MobileContractDetailsPage />;
};

export default ContractDetailsPage;
