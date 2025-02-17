import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useClientStore } from '@/stores/clientStore';
import { AccountPopover, AccountPopoverContent, AccountPopoverTrigger } from '@/components/ui/account-popover';
import { AccountInfo } from './AccountInfo';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

export const AccountSwitcher: React.FC = () => {
  const { balance, currency, accountType } = useClientStore();
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
            <span className="text-sm font-semibold text-color-solid-glacier-700">
              {accountType === 'real' ? 'Real' : 'Demo'}
            </span>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-color-solid-glacier-700" />
            ) : (
              <ChevronDown className="h-4 w-4 text-color-solid-glacier-700" />
            )}
          </div>
          <span className="text-sm font-semibold align-start">
            {balance} {currency}
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
