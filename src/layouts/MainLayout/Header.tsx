import React from 'react';
import { BalanceDisplay } from '@/components/BalanceDisplay';
import { useOrientationStore } from '@/stores/orientationStore';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { isLandscape } = useOrientationStore();

  return (
    <header className={`${!isLandscape ? 'flex' : 'hidden'} flex items-center gap-4 px-4 py-2 border-b border-opacity-10 bg-white ${className}`} id="header">
      <BalanceDisplay className="flex-1" />
    </header>
  );
};
