import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHeaderStore } from "@/stores/headerStore";
import { useBottomNavStore } from "@/stores/bottomNavStore";
import DesktopContractDetailsPage from "./DesktopContractDetailsPage";
import { ContractDetailsChart } from "@/components/ContractDetailsChart";
import {
  Header,
  ContractSummary,
  OrderDetails,
  Payout,
  EntryExitDetails,
} from "./components";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";

const MobileContractDetailsPage: React.FC = () => {
  const navigate = useNavigate();
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
    <div className="w-full bg-gray-100 dark:bg-black h-screen flex flex-col">
      <Header />
      <div className="flex-1 overflow-y-auto w-full lg:w-3/5 mx-auto">
        <div className="p-2 pb-[56px]">
          <ContractSummary />
          <div className="min-h-[400px] bg-white rounded-lg border-b border-gray-300">
            <ContractDetailsChart />
          </div>
          <OrderDetails />
          <Payout />
          <EntryExitDetails />
        </div>

        {/* Close Button */}
        <div className="fixed bottom-0 left-0 right-0 z-[60]">
          <div className="mx-2 mb-2 text-center">
            <button
              onClick={() => navigate(-1)}
              className="text-white bg-black max-w-[500px] mx-auto w-full p-3 px-8 text-center rounded-xl shadow-md"
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
  const { isMobile } = useDeviceDetection();
  return isMobile ? (
    <MobileContractDetailsPage />
  ) : (
    <DesktopContractDetailsPage />
  );
};

export default ContractDetailsPage;
