import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useClientStore } from "@/stores/clientStore";
import { useAccount } from "@/hooks/useAccount";
import {
    AccountPopover,
    AccountPopoverContent,
    AccountPopoverTrigger,
} from "@/components/ui/account-popover";
import { AccountInfo } from "./AccountInfo";
import { useOrientationStore } from "@/stores/orientationStore";

export const AccountSwitcher: React.FC = () => {
    const { balance } = useClientStore();
    const { selectedAccount } = useAccount();
    const { isLandscape } = useOrientationStore();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <AccountPopover onOpenChange={setIsOpen}>
            <AccountPopoverTrigger asChild>
                <button
                    data-testid="balance-display"
                    className={`flex flex-col relative ${
                        isLandscape ? "items-end" : "items-start"
                    }`}
                >
                    <div className="flex items-center gap-1">
                        <span
                            className={`text-sm font-semibold ${
                                selectedAccount?.isDemo
                                    ? "text-orange-500"
                                    : "text-color-solid-glacier-700"
                            }`}
                        >
                            {selectedAccount?.isDemo ? "Demo" : "Real"}
                        </span>
                        {isOpen ? (
                            <ChevronUp
                                className={`h-4 w-4 ${
                                    selectedAccount?.isDemo
                                        ? "text-orange-500"
                                        : "text-color-solid-glacier-700"
                                }`}
                            />
                        ) : (
                            <ChevronDown
                                className={`h-4 w-4 ${
                                    selectedAccount?.isDemo
                                        ? "text-orange-500"
                                        : "text-color-solid-glacier-700"
                                }`}
                            />
                        )}
                    </div>
                    <span className="text-sm font-semibold align-start">
                        {selectedAccount?.isDemo ? "10,000" : balance}{" "}
                        {selectedAccount?.currency || "USD"}
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
