import React from 'react';
import { formatDurationDisplay } from '@/utils/duration';

interface TradeParamProps {
  label: string;
  value: string;
  onClick?: () => void;
  className?: string;
}

const TradeParam: React.FC<TradeParamProps> = ({ label, value, onClick, className }) => {
  const formattedValue = label === "Duration" ? formatDurationDisplay(value) : value;

  const containerClasses = "w-full bg-gray-50 rounded-2xl p-4 flex flex-col gap-1";
  const labelClasses = "w-full text-left font-ibm-plex text-xs leading-[18px] font-normal text-gray-500";
  const valueClasses = "w-full text-left font-ibm-plex text-base leading-6 font-normal text-gray-900";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        className={`${containerClasses} ${className}`}
        aria-label={`${label}: ${value}`}
      >
        <span className={labelClasses}>{label}</span>
        <span className={valueClasses}>{formattedValue}</span>
      </button>
    );
  }

  return (
    <div className={`${containerClasses} ${className}`}>
      <span className={labelClasses}>{label}</span>
      <span className={valueClasses}>{formattedValue}</span>
    </div>
  );
};

export default TradeParam;
