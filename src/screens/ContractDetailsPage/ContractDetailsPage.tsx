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
  EntryExitDetails,
} from "./components";
import { useOrientationStore } from "@/stores/orientationStore";

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
    <div className="w-full bg-gray-100 dark:bg-gray-900 text-textPrimaryColor dark:text-white h-screen flex flex-col overflow-y-auto">
      <Header />
      <div className="overflow-y-auto w-full lg:w-3/5 mx-auto">
        <div className="p-2 pb-[72px]">
          <ContractSummary />
          <div className="min-h-[400px] mt-4 bg-backgroundLight rounded-lg border-b border-borderLight">
            <ContractDetailsChart />
          </div>
          <OrderDetails />
          <EntryExitDetails />
        </div>

        {/* Close Button */}
        <div className="fixed bottom-1 left-0 right-0 z-[60]">
          <div className="mx-2 my-2 text-center">
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
  const { isLandscape } = useOrientationStore();
  return !isLandscape ? (
    <MobileContractDetailsPage />
  ) : (
    <DesktopContractDetailsPage />
  );
};

export default ContractDetailsPage;
