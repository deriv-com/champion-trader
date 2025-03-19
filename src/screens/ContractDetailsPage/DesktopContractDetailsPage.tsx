import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import { X } from "lucide-react";
import { ContractSummary, EntryExitDetails, OrderDetails } from "./components";
import { ContractDetailsChart } from "@/components/ContractDetailsChart/ContractDetailsChart";
import { useTradeStore } from "@/stores/tradeStore";
import { useTradeActions } from "@/hooks/useTradeActions";

const DesktopContractDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const { setSideNavVisible } = useMainLayoutStore();
    const contractDetails = useTradeStore((state) => state.contractDetails);
    const tradeActions = useTradeActions();
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        // Hide SideNav when component mounts
        setSideNavVisible(false);

        // Show SideNav when component unmounts
        return () => setSideNavVisible(true);
    }, [setSideNavVisible]);

    const handleCloseContract = async () => {
        if (!contractDetails?.contract_id) return;

        try {
            await tradeActions.sell_contract(contractDetails.contract_id, contractDetails, {
                setLoading: setIsClosing,
                onSuccess: () => navigate(-1),
            });
        } catch (error) {
            // Error handling is done in the hook
        }
    };

    return (
        <div
            className="flex flex-col bg-theme-secondary w-full"
            data-testid="desktop-contract-details"
        >
            <div className="flex justify-between items-center p-4 bg-theme">
                <h1 className="text-xl font-bold mx-auto">Contract details</h1>
                <button onClick={() => navigate(-1)} className="text-theme-muted">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden relative m-4">
                <div className="w-[320px] flex flex-col" data-testid="left-panel">
                    <div
                        className="flex-1 overflow-y-auto pb-20 space-y-4 bg-theme-secondary scrollbar-thin"
                        data-testid="content-area"
                    >
                        <ContractSummary />
                        <OrderDetails />
                        <EntryExitDetails />
                    </div>
                    <div
                        className="absolute bottom-0 left-0 right-0 m-4 w-[290px] b-[55px]"
                        data-testid="close-button-container"
                    >
                        <div className="max-w-[1200px] mx-auto">
                            <button
                                onClick={handleCloseContract}
                                disabled={
                                    isClosing ||
                                    !contractDetails?.contract_id ||
                                    !contractDetails?.is_valid_to_sell ||
                                    contractDetails?.is_sold
                                }
                                className="w-full bg-action-button text-action-button py-3 rounded-lg disabled:opacity-50"
                            >
                                {isClosing
                                    ? "Closing..."
                                    : `Close ${contractDetails?.bid_price || ""} ${contractDetails?.bid_price_currency || ""}`}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex flex-col">
                    <div className="ml-4 h-full">
                        <ContractDetailsChart />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesktopContractDetailsPage;
