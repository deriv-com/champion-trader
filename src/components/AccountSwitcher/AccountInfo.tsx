import React from 'react';
import { useClientStore } from '@/stores/clientStore';
import { LogOut } from 'lucide-react';
import { accountData } from '@/config/accountConfig';

export const AccountInfo: React.FC = () => {
  const { balance, currency, accountType, logout, setAccountType, selectedAccountId, setSelectedAccountId } = useClientStore();
  // const selectedAccount = accountData.find(account => account.id === selectedAccountId);

  return (
    <div className="w-full min-w-[280px]">
      <div className="flex border-b border-gray-200 text-sm">
        <button
          className={`flex-1 py-2 text-center ${
            accountType === 'real'
              ? 'font-semibold border-b-2 border-black'
              : 'text-gray-500'
          }`}
          onClick={() => setAccountType('real')}
        >
          Real
        </button>
        <button
          className={`flex-1 py-2 text-center ${
            accountType === 'demo'
              ? 'font-semibold border-b-2 border-black'
              : 'text-gray-500'
          }`}
          onClick={() => setAccountType('demo')}
        >
          Demo
        </button>
      </div>

      <div className="p-4">
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold">Trading account</h3>
          {accountType === 'real' ? (
            <div className="flex flex-col gap-2">
              {accountData.map((account) => (
                <button
                  key={account.id}
                  className={`flex items-center p-2 rounded hover:bg-gray-50 ${
                    selectedAccountId === account.id ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => setSelectedAccountId(account.id)}
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white">{account.symbol}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold">{account.displayName}</p>
                    <p className="text-xs text-gray-500">{account.accountNumber}</p>
                  </div>
                  <p className="text-sm ml-4">
                    0.00 {account.currency}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-white">D</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">Demo Account</p>
                  <p className="text-xs text-gray-500">VRTC5722704</p>
                </div>
              </div>
              <button className="px-2 py-1 text-xs border border-gray-400 rounded hover:bg-gray-300">
                Reset balance
              </button>
            </div>
          )}

          <div className="w-full h-1 bg-gray-100"></div>
          <div>
            <div className="flex items-center gap-2 justify-between pb-2">
              <p className="text-sm text-gray-500">Total assets</p>
              <p className="text-sm">
                {balance} {currency}
              </p>
            </div>
            <p className="text-xs text-gray-400">Total assets in your Deriv accounts.</p>
          </div>

          <div className="w-full h-1 bg-gray-100"></div>
          <div className="flex justify-end text-sm">
            <button className="flex items-center gap-2 text-gray-700" onClick={logout}>
              <span>Log out</span>
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
