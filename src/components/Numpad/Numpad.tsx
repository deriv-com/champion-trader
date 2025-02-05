import React from "react";
import { useTradeStore } from "@/stores/tradeStore";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";

interface NumpadProps {
  context: "stake" | "duration";
  onInput: (value: string) => void;
  onDelete: () => void;
}

const Numpad: React.FC<NumpadProps> = ({ context }) => {
  const buttons = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
  ];

  const { setStake, setDuration, numpadValue, setNumpadValue } = useTradeStore();
  const { key } = useBottomSheetStore();

  return (
    <div className="flex flex-col gap-2 p-2 rounded-lg">
      <div className="flex items-center justify-between p-2 border rounded">
        <input
          type="text"
          value={numpadValue}
          onChange={(e) => setNumpadValue(e.target.value)}
          className="flex-1 text-lg text-center outline-none focus:border-black"
          placeholder="0"
        onBlur={() => key === "stake" ? setStake(numpadValue) : setDuration(numpadValue)}
        />
        <span className="ml-2 text-lg font-semibold">{context === "duration" ? "ticks" : "USD"}</span>
      </div>
      <div className="flex justify-between gap-1 mb-4">
        {[3, 5, 10, 25, 50].map((chip) => (
          <button
            key={chip}
            className="px-6 py-3 text-white bg-black rounded-full hover:bg-gray-800 text-center"
            value={chip}
            onClick={(e) => {
              const chip_value = Number(e.currentTarget.value);
              setNumpadValue(!numpadValue ? chip_value.toString() : (parseFloat(numpadValue) + chip_value).toString());
            }}
          >
            {chip}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 mt-1">
        {buttons.map((button) => (
          <button
            key={button.value}
            className="p-4 text-lg font-bold rounded hover:bg-gray-300"
            onClick={() => setNumpadValue(numpadValue + button.value)}
          >
            {button.label}
          </button>
        ))}
        <button
          className="p-4 text-lg font-bold rounded hover:bg-gray-300"
          onClick={() => setNumpadValue(numpadValue + ".")}
        >
          .
        </button>
        <button
          className="p-4 text-lg font-bold rounded hover:bg-gray-300"
          onClick={() => setNumpadValue(numpadValue + "0")}
        >
          0
        </button>
        <button
          className="p-4 text-lg font-bold rounded hover:bg-gray-300"
          onClick={() => setNumpadValue(numpadValue.slice(0, -1))}
        >
          ⌫
        </button>
      </div>
    </div>
  );
};

export default Numpad;
