import React from 'react';
import { useClientStore } from '@/stores/clientStore';
import { useOrientationStore } from '@/stores/orientationStore';

interface BalanceDisplayProps {
  onDeposit?: () => void;
  depositLabel?: string;
  className?: string;
  loginUrl?: string;
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
  onDeposit,
  depositLabel = 'Deposit',
  className = '',
  loginUrl = 'https://options-trading.deriv.ai/',
}) => {
  const { isLoggedIn, balance, currency } = useClientStore();
  const { isLandscape } = useOrientationStore();

  if (!isLoggedIn) {
    return (
      <div className={`w-full flex items-center justify-end ${className}`}>
        <a 
          href={loginUrl}
          className="px-4 py-2 font-bold text-white bg-color-solid-glacier-700 rounded-3xl hover:bg-color-solid-glacier-600"
        >
          Log in
        </a>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between ${isLandscape ? 'gap-4' : ''} ${className}`}>
      <div className="flex flex-col">
        <span className="text-sm text-gray-700">Real</span>
        <span className="text-sm font-bold text-teal-500">{balance} {currency}</span>
      </div>
      <button 
        className="px-4 py-2 font-bold border border-gray-700 rounded-3xl"
        onClick={onDeposit}
      >
        {depositLabel}
      </button>
    </div>
  );
};
