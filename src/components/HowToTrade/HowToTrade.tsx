import React from 'react';
import { useBottomSheetStore } from '@/stores/bottomSheetStore';

export const HowToTrade: React.FC = () => {
  const { setBottomSheet } = useBottomSheetStore();

  const handleClick = () => {
    setBottomSheet(true, 'how-to-trade', '470px');
  };

  return (
    <button
      onClick={handleClick}
      className="text-gray-500 hover:text-gray-600 text-sm flex items-center gap-1"
    >
      How to trade Rise/Fall?
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 4.5l7.5 7.5-7.5 7.5"
        />
      </svg>
    </button>
  );
};

export default HowToTrade;
