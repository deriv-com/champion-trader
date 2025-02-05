import React from "react";
import Numpad from "@/components/Numpad/Numpad";

const DurationBody: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center text-center">
        <h2 className="text-lg font-semibold mx-auto">Duration</h2>
      </div>
      <Numpad context="duration" onInput={(value) => console.log(value)} onDelete={() => console.log("Delete")} />
    </div>
  );
};

export default DurationBody;
