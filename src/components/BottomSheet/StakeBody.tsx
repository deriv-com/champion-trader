import React from "react";
import Numpad from "@/components/Numpad/Numpad";

const StakeBody: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center text-center">
        <h2 className="text-lg font-semibold mx-auto">Stake</h2>
      </div>
      <Numpad context="stake" onInput={(value) => console.log(value)} onDelete={() => console.log("Delete")} />
    </div>
  );
};

export default StakeBody;
