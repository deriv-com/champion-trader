import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAccount } from "@/hooks/useAccount";
import { useClientStore } from "@/stores/clientStore";
import {
    AccountPopover,
    AccountPopoverContent,
    AccountPopoverTrigger,
} from "@/components/ui/account-popover";
import { AccountInfo } from "./AccountInfo";
import { useOrientationStore } from "@/stores/orientationStore";

export const AccountSwitcher: React.FC = () => {
    const { isDemo } = useAccount();
    const { balance, currency } = useClientStore();

    const { isLandscape } = useOrientationStore();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <AccountPopover onOpenChange={setIsOpen}>
            <AccountPopoverTrigger asChild>
                <button data-testid="balance-display" className="flex flex-col relative">
                    <div className="flex items-center gap-1">
                        <span
                            className={`text-sm font-semibold ${
                                isDemo ? "text-orange-500" : "text-color-brand-700"
                            }`}
                        >
                            {isDemo ? "Demo" : "Real"}
                        </span>
                        {isOpen ? (
                            <ChevronUp
                                className={`h-4 w-4 ${
                                    isDemo ? "text-orange-500" : "text-color-brand-700"
                                }`}
                            />
                        ) : (
                            <ChevronDown
                                className={`h-4 w-4 ${
                                    isDemo ? "text-orange-500" : "text-color-brand-700"
                                }`}
                            />
                        )}
                    </div>
                    <span className="text-base font-semibold align-start">
                        {balance} {currency}
                    </span>
                </button>
            </AccountPopoverTrigger>
            <AccountPopoverContent align={isLandscape ? "end" : "start"}>
                <AccountInfo onSelect={() => setIsOpen(false)} />
            </AccountPopoverContent>
        </AccountPopover>
    );
};

export default AccountSwitcher;
