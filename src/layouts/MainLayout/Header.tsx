import React from 'react';

interface HeaderProps {
  balance: string;
}

export const Header: React.FC<HeaderProps> = ({ balance }) => {
  return (
    <header className="flex items-center justify-between p-4">
      <div className="flex flex-col">
        <span className="text-sm text-gray-700">Real</span>
        <span className="text-2xl font-bold text-teal-500">{balance}</span>
      </div>

      <button className="px-4 py-2 font-bold border border-gray-700 rounded-3xl">
        Deposit
      </button>
    </header>
  );
};
