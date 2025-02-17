import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useClientStore } from '@/stores/clientStore';
import { useAccount } from '@/hooks/useAccount';
import { AccountPopover, AccountPopoverContent, AccountPopoverTrigger } from '@/components/ui/account-popover';
import { AccountInfo } from './AccountInfo';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

export const AccountSwitcher: React.FC = () => {
  const { balance } = useClientStore();
  const { accountType, selectedAccount } = useAccount();
  const { isMobile } = useDeviceDetection();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AccountPopover onOpenChange={setIsOpen}>
      <AccountPopoverTrigger asChild>
        <button
          data-testid="balance-display"
          className={`flex flex-col relative ${
            isMobile ? 'items-start' : 'items-end'
          }`}
        >
          <div className="flex items-center gap-1">
            <span className={`text-sm font-semibold ${accountType === 'real' ? 'text-color-solid-glacier-700' : 'text-orange-500'}`}>
              {accountType === 'real' ? 'Real' : 'Demo'}
            </span>
            {isOpen ? (
              <ChevronUp className={`h-4 w-4 ${accountType === 'real' ? 'text-color-solid-glacier-700' : 'text-orange-500'}`} />
            ) : (
              <ChevronDown className={`h-4 w-4 ${accountType === 'real' ? 'text-color-solid-glacier-700' : 'text-orange-500'}`} />
            )}
          </div>
          <span className="text-sm font-semibold align-start">
            {balance} {accountType === 'real' ? selectedAccount?.currency : 'USD'}
          </span>
        </button>
      </AccountPopoverTrigger>
      <AccountPopoverContent
        align={isMobile ? "start" : "end"}
      >
        <AccountInfo />
      </AccountPopoverContent>
    </AccountPopover>
  );
};

export default AccountSwitcher;
