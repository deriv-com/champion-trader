import React from "react";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { useTradeStore } from "@/stores/tradeStore";

export const DurationStakeField: React.FC = () => {
  const { setBottomSheet, setKey } = useBottomSheetStore();

  const { stake, duration } = useTradeStore();

  const handleInputClick = (key: string) => {
    setKey(key);
  };

  return (
    <div className="flex flex-col gap-4">
      <>
        <div className="p-4 border rounded cursor-pointer" onClick={() => handleInputClick("stake")}>
          Stake: {stake}
        </div>
        <div className="p-4 border rounded cursor-pointer" onClick={() => handleInputClick("duration")}>
          Duration: {duration}
        </div>
      </>
    </div>
  );
};

export default DurationStakeField;
