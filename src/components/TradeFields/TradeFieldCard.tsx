import React from 'react';

interface TradeFieldCardProps {
  children: React.ReactNode;
  className?: string;
}

export const TradeFieldCard: React.FC<TradeFieldCardProps> = ({ 
  children,
  className 
}) => (
  <div className={`flex-1 min-w-[120px] h-auto bg-black/[0.04] rounded-lg py-4 ${className}`}>
    {children}
  </div>
);
