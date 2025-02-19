import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHeaderStore } from "@/stores/headerStore";
import { useBottomNavStore } from "@/stores/bottomNavStore";
import {
  Header,
  ContractSummary,
  OrderDetails,
  Chart,
  Payout,
  EntryExitDetails,
} from "./components";

const ContractDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const setHeaderVisible = useHeaderStore(state => state.setIsVisible);
  const setBottomNavVisible = useBottomNavStore(state => state.setIsVisible);

  useEffect(() => {
    setHeaderVisible(false);
    setBottomNavVisible(false);
    return () => {
      setHeaderVisible(true);
      setBottomNavVisible(true);
    };
  }, [setHeaderVisible, setBottomNavVisible]);
  return (
    <div className="w-full bg-gray-100 h-screen flex flex-col">
      <Header />
      <div className="flex-1 overflow-y-auto w-full lg:w-3/5 mx-auto">
        <div className="p-2 pb-[56px]">
          <ContractSummary />
          <Chart />
          <OrderDetails />
          <Payout />
          <EntryExitDetails />
        </div>
      </div>  

      {/* Close Button */}
      <div className=" fixed bottom-0 left-0 right-0 z-[60]">
        <div className="mx-2  text-center">
          <button
            onClick={() => navigate(-1)}
            className="text-white bg-black max-w-[500px] mx-auto  w-full p-3 px-8 text-center rounded-xl shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractDetailsPage;
