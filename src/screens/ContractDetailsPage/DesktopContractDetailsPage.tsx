import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import { X } from "lucide-react";
import { ContractSummary, EntryExitDetails, OrderDetails } from "./components";
import { ContractDetailsChart } from "@/components/ContractDetailsChart/ContractDetailsChart";

const DesktopContractDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const { setSideNavVisible } = useMainLayoutStore();

    useEffect(() => {
        // Hide SideNav when component mounts
        setSideNavVisible(false);

        // Show SideNav when component unmounts
        return () => setSideNavVisible(true);
    }, [setSideNavVisible]);

    return (
        <div className="flex flex-col bg-theme w-full" data-testid="desktop-contract-details">
            <div className="flex justify-between items-center p-4 bg-theme">
                <h1 className="text-xl font-bold mx-auto">Contract details</h1>
                <button onClick={() => navigate(-1)} className="text-theme-muted">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden relative m-4">
                <div className="w-[320px] bg-theme flex flex-col" data-testid="left-panel">
                    <div
                        className="flex-1 overflow-y-auto pb-20 space-y-4 bg-theme"
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
                                onClick={() => navigate(-1)}
                                className="w-full bg-action-button text-action-button py-3 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex flex-col">
                    <div className="ml-4 bg-theme rounded-lg border border-theme h-full text-theme-muted">
                        <ContractDetailsChart />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesktopContractDetailsPage;
