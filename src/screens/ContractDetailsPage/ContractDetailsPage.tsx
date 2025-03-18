import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHeaderStore } from "@/stores/headerStore";
import { useBottomNavStore } from "@/stores/bottomNavStore";
import DesktopContractDetailsPage from "./DesktopContractDetailsPage";
import { ContractDetailsChart } from "@/components/ContractDetailsChart/ContractDetailsChart";
import { Header, ContractSummary, OrderDetails, EntryExitDetails } from "./components";
import { useOrientationStore } from "@/stores/orientationStore";
import { useTradeStore } from "@/stores/tradeStore";
import { useTradeActions } from "@/hooks/useTradeActions";
import { useToastStore } from "@/stores/toastStore";
import { TradeNotification } from "@/components/ui/trade-notification";
import { StandaloneFlagCheckeredFillIcon } from "@deriv/quill-icons";

const MobileContractDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const setHeaderVisible = useHeaderStore((state) => state.setIsVisible);
    const setBottomNavVisible = useBottomNavStore((state) => state.setIsVisible);
    const contractDetails = useTradeStore((state) => state.contractDetails);
    const tradeActions = useTradeActions();
    const [isClosing, setIsClosing] = useState(false);
    const { toast, hideToast } = useToastStore();
    const { isLandscape } = useOrientationStore();

    useEffect(() => {
        setHeaderVisible(false);
        setBottomNavVisible(false);
        return () => {
            setHeaderVisible(true);
            setBottomNavVisible(true);
        };
    }, [setHeaderVisible, setBottomNavVisible]);

    const handleCloseContract = async () => {
        if (!contractDetails?.contract_id) return;

        setIsClosing(true);
        try {
            const response = await tradeActions.sell_contract(contractDetails.contract_id);
            const isProfit = Number(response.data.profit) >= 0;

            // Show success toast with TradeNotification
            toast({
                content: (
                    <TradeNotification
                        stake={`${isProfit ? "Profit" : "Loss"}: ${response.data.profit} ${contractDetails.bid_price_currency}`}
                        market={contractDetails.instrument_id}
                        type={
                            contractDetails.variant.charAt(0).toUpperCase() +
                            contractDetails.variant.slice(1)
                        }
                        onClose={hideToast}
                        icon={
                            <div>
                                <StandaloneFlagCheckeredFillIcon
                                    fill={Number(response.data.profit) >= 0 ? "#007a22" : "#FF4D4D"}
                                    iconSize="sm"
                                    className={`rounded-full ${isProfit ? "#0088323D" : "#E6190E3D"}`}
                                />
                            </div>
                        }
                    />
                ),
                variant: "default",
                duration: 3000,
                position: isLandscape ? "bottom-left" : "top-center",
            });

            navigate(-1);
        } catch (error: any) {
            // Extract error message from API response if available
            let errorMessage = "Failed to close contract";

            if (error.response?.data?.errors?.[0]?.message) {
                errorMessage = error.response.data.errors[0].message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            // Show error toast
            toast({
                content: errorMessage,
                variant: "error",
            });

            console.error("Error closing contract:", error);
            setIsClosing(false);
        }
    };

    return (
        <div className="w-full bg-theme-secondary h-screen flex flex-col">
            <Header />
            <div className="flex-1 overflow-y-auto w-full lg:w-3/5 mx-auto">
                <div className="p-2 pb-[72px]">
                    <ContractSummary />
                    <div className="min-h-[400px] mt-4">
                        <ContractDetailsChart />
                    </div>
                    <OrderDetails />
                    <EntryExitDetails />
                </div>

                {/* Close Button */}
                <div className="fixed bottom-1 left-0 right-0 z-[60]">
                    <div className="mx-2 my-2 text-center">
                        <button
                            onClick={handleCloseContract}
                            disabled={
                                isClosing || !contractDetails?.contract_id
                                // Temporarily removed: !contractDetails?.is_valid_to_sell
                            }
                            className="text-action-button bg-action-button max-w-[500px] mx-auto w-full p-3 px-8 text-center rounded-xl shadow-md disabled:text-theme-muted"
                        >
                            {isClosing
                                ? "Closing..."
                                : `Close ${contractDetails?.bid_price || ""} ${contractDetails?.bid_price_currency || ""}`}
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
