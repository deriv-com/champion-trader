import React from "react";

export const PositionsPage: React.FC = () => {
  return (
    <div className="flex flex-col flex-1 p-4">
      <h1 className="text-2xl font-bold">Positions</h1>
      <div className="flex-1 flex items-center justify-center text-gray-500">
        No open positions
      </div>
    </div>
  );
};
