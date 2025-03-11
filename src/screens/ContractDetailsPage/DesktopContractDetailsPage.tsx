import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import { useContractDetailsStream } from "@/hooks/useContractDetailsStream";
import { useContractDetailsRest } from "@/hooks/useContractDetailsRest";
import { useTradeStore } from "@/stores/tradeStore";
import { X } from "lucide-react";
import { EntryExitDetails, OrderDetails } from "./components";
import { ContractCard } from "@/components/ContractCard";
import { ContractDetailsChart } from "@/components/ContractDetailsChart/ContractDetailsChart";

const DesktopContractDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { setSideNavVisible } = useMainLayoutStore();
    const { loading: streamLoading, error: streamError } = useContractDetailsStream(id);
    const { loading: fallbackLoading, error: fallbackError } = useContractDetailsRest(id);
    const contractDetails = useTradeStore((state) => state.contractDetails);

    // Combine loading and error states from both hooks
    const loading = streamLoading || fallbackLoading;
    const error = streamError || fallbackError;

    useEffect(() => {
        // Hide SideNav when component mounts
        setSideNavVisible(false);

        // Show SideNav when component unmounts
        return () => setSideNavVisible(true);
    }, [setSideNavVisible]);

    // Show loading state
    if (loading && !contractDetails) {
        return (
            <div
                className="flex flex-col bg-gray-50 w-full h-screen items-center justify-center"
                data-testid="desktop-contract-details-loading"
            >
                <div className="text-center">
                    <p>Loading contract details...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error && !contractDetails) {
        return (
            <div
                className="flex flex-col bg-gray-50 w-full h-screen items-center justify-center"
                data-testid="desktop-contract-details-error"
            >
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
        <div className="flex flex-col bg-gray-50 w-full" data-testid="desktop-contract-details">
            <div className="flex justify-between items-center p-4 bg-white">
                <h1 className="text-xl font-bold mx-auto">Contract details</h1>
                <button onClick={() => navigate(-1)} className="text-gray-600">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden relative m-4">
                <div className="w-[320px] bg-white flex flex-col" data-testid="left-panel">
                    <div
                        className="flex-1 overflow-y-auto pb-20 space-y-4 bg-gray-50"
                        data-testid="content-area"
                    >
                        {contractDetails && (
                            <ContractCard contract={contractDetails} variant="mobile" />
                        )}
                        <OrderDetails />
                        <EntryExitDetails />
                    </div>
                    <div
                        className="absolute bottom-0 left-0 right-0 m-4 w-[290px] b-[55px]"
                        data-testid="close-button-container"
                    >
                        <div className="max-w-[1200px] mx-auto">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-full bg-black text-white py-3 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex flex-col">
                    <div className="ml-4 bg-white rounded-lg border h-full text-gray-500">
                        <ContractDetailsChart />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesktopContractDetailsPage;
