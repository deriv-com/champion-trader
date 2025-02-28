import React from 'react';
import { formatDurationDisplay } from '@/utils/duration';

interface TradeParamProps {
  label: string;
  value: string;
  onClick?: () => void;
  className?: string;
}

const TradeParam: React.FC<TradeParamProps> = ({ 
  label, 
  value, 
  onClick, 
  className
}) => {
  const formattedValue = label === "Duration" ? formatDurationDisplay(value) : value;

  const labelClasses = "text-left font-ibm-plex text-xs leading-[18px] font-normal text-[var(--text-color)]";
  const valueClasses = "text-left font-ibm-plex text-base leading-6 font-normal text-[var(--text-color)] bg-[var(--background-color)]";
  
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
        className={`${className} text-start`}
        aria-label={`${label}: ${value}`}
      >
        <span className={labelClasses}>{label}</span>
        <div className="text-left">
          <span className={valueClasses}>{formattedValue}</span>
        </div>
      </button>
    );
  }

  return (
    <div className={`${className} text-start dark:bg-gray-900 dark:text-white p-3 rounded-lg`}>
      <span className={labelClasses}>{label}</span>
      <div className="text-left">
        <span className={valueClasses}>{formattedValue}</span>
      </div>
    </div>
  );
};

export default TradeParam;
