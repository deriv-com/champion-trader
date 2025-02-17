import React from 'react';
import { useClientStore } from '@/stores/clientStore';
import { LogOut } from 'lucide-react';

export const AccountInfo: React.FC = () => {
  const { balance, currency, accountType, setAccountType } = useClientStore();

  return (
    <div className="w-full min-w-[280px]">
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-2 text-center ${
            accountType === 'real'
              ? 'text-color-solid-glacier-700 font-semibold border-b-2 border-color-solid-glacier-700'
              : 'text-gray-500'
          }`}
          onClick={() => setAccountType('real')}
        >
          Real
        </button>
        <button
          className={`flex-1 py-2 text-center ${
            accountType === 'demo'
              ? 'text-color-solid-glacier-700 font-semibold border-b-2 border-color-solid-glacier-700'
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-white">₿</span>
              </div>
              <div>
                <p className="font-semibold">{accountType === 'real' ? 'Real' : 'Demo'}</p>
                <p className="text-sm text-gray-500">VRTC5722704</p>
              </div>
            </div>
            <button className="px-2 py-1 text-sm border rounded hover:bg-gray-300">
              Reset balance
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2 justify-between">
              <p className="text-sm text-gray-500 pb-2">Total assets</p>
              <p className="text-sm font-semibold">
                {balance} {currency}
              </p>
            </div>
            <p className="text-xs text-gray-400">Total assets in your Deriv accounts.</p>
          </div>

          <div className="flex justify-end">
            <button className="flex items-center gap-2 text-gray-700">
              <span>Log out</span>
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
