import React from "react";

export const MenuPage: React.FC = () => {
  return (
    <div className="flex flex-col flex-1 p-4">
      <h1 className="text-2xl font-bold">Menu</h1>
      <div className="flex flex-col gap-4 mt-4">
        <button className="text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
          Settings
        </button>
        <button className="text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
          Help Center
        </button>
        <button className="text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
          About
        </button>
      </div>
    </div>
  );
};
