import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useContractDetails } from "@/hooks/contract/useContract";
import { useHeaderStore } from "@/stores/headerStore";
import { useBottomNavStore } from "@/stores/bottomNavStore";
import DesktopContractDetailsPage from "./DesktopContractDetailsPage";
import { Header, ContractDetailsPageSummary } from "./components";
import { ContractDetailsChart } from "@/components/ContractDetailsChart/ContractDetailsChart";
import { useOrientationStore } from "@/stores/orientationStore";

const MobileContractDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const { contract_id } = useParams<{ contract_id: string }>();
    const { contract, loading, error } = useContractDetails(contract_id || "");
    const setHeaderVisible = useHeaderStore((state) => state.setIsVisible);
    const setBottomNavVisible = useBottomNavStore((state) => state.setIsVisible);

    useEffect(() => {
        setHeaderVisible(false);
        setBottomNavVisible(false);
        return () => {
            setHeaderVisible(true);
            setBottomNavVisible(true);
        };
    }, [setHeaderVisible, setBottomNavVisible]);

    return (
        <div className="w-full bg-theme-secondary h-screen flex flex-col">
            <Header />
            <div className="flex-1 overflow-y-auto w-full lg:w-3/5 mx-auto">
                <div className="p-2 pb-[72px]">
                    <ContractDetailsPageSummary
                        contract={contract}
                        loading={loading}
                        error={error}
                    />
                    {!loading && contract && (
                        <div className="min-h-[400px] mt-4">
                            <ContractDetailsChart
                                contract={contract}
                                loading={loading}
                                error={error}
                            />
                        </div>
                    )}
                </div>

                {/* Close Button */}
                <div className="fixed bottom-1 left-0 right-0 z-[60]">
                    <div className="mx-2 my-2 text-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-action-button bg-action-button max-w-[500px] mx-auto w-full p-3 px-8 text-center rounded-xl shadow-md"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ContractDetailsPage: React.FC = () => {
    const { isLandscape } = useOrientationStore();
    return !isLandscape ? <MobileContractDetailsPage /> : <DesktopContractDetailsPage />;
};

export default ContractDetailsPage;
