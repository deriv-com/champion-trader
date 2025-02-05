import React from 'react';
import { Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BalanceDisplay } from '@/components/BalanceDisplay';
import { useOrientationStore } from '@/stores/orientationStore';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLandscape } = useOrientationStore();

  const handleMenuClick = () => {
    navigate(location.pathname === '/menu' ? '/trade' : '/menu');
  };

  return (
    <header className={`${!isLandscape ? 'flex' : 'hidden'} flex items-center gap-4 px-4 py-2 border-b border-opacity-10 bg-white ${className}`} id="header">
      <button 
        onClick={handleMenuClick}
        className={`flex flex-col items-center ${
          location.pathname === '/menu' ? 'text-primary' : 'text-gray-500'
        }`}
      >
        <Menu className="w-5 h-5" />
      </button>
      <BalanceDisplay className="flex-1" />
    </header>
  );
};
