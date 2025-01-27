import React from "react";

interface TradeButtonProps {
  className?: string;
  title: string;
  label: string;
  value: string;
  title_position: "left" | "right";
}

export const TradeButton: React.FC<TradeButtonProps> = ({
  className = "",
  title,
  label,
  value,
  title_position,
}) => {
  const isLeft = title_position === "left";

  return (
    <button
      className={`flex items-center justify-between w-full px-6 py-4 rounded-full ${className}`}
    >
      {isLeft ? (
        <>
          <div className="flex flex-col items-start">
            <span className="text-xl font-bold text-white">{title}</span>
            <span className="text-sm text-white/80">{label}</span>
          </div>
          <span className="text-xl font-bold text-white">{value}</span>
        </>
      ) : (
        <>
          <span className="text-xl font-bold text-white">{value}</span>
          <div className="flex flex-col items-end">
            <span className="text-xl font-bold text-white">{title}</span>
            <span className="text-sm text-white/80">{label}</span>
          </div>
        </>
      )}
    </button>
  );
};
