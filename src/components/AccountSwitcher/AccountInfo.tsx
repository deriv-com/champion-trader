import React from "react";
import { useClientStore } from "@/stores/clientStore";
import { LogOut } from "lucide-react";
import { useAccount } from "@/hooks/useAccount";
import { CurrencyIcon } from "@/components/Currency/CurrencyIcon";
import { useLogout } from "@/hooks/useLogout";
import * as Popover from "@radix-ui/react-popover";

interface AccountInfoProps {
    onSelect: () => void;
}

export const AccountInfo: React.FC<AccountInfoProps> = ({ onSelect }) => {
    const { balance, currency, setBalance } = useClientStore();
    const {
        accountType,
        selectedAccountId,
        switchAccountType,
        selectAccount,
        getAvailableAccounts,
    } = useAccount();
    const logout = useLogout();

    return (
        <div className="w-full min-w-[280px]">
            <div className="flex border-b border-theme text-sm">
                <button
                    className={`flex-1 py-2 text-center ${
                        accountType === "real"
                            ? "font-semibold border-b-2 border-theme-text"
                            : "text-theme-muted"
                    }`}
                    onClick={() => switchAccountType("real")}
                >
                    Real
                </button>
                <button
                    className={`flex-1 py-2 text-center ${
                        accountType === "demo"
                            ? "font-semibold border-b-2 border-theme-text"
                            : "text-theme-muted"
                    }`}
                    onClick={() => switchAccountType("demo")}
                >
                    Demo
                </button>
            </div>

            <div className="p-4">
                <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-semibold">Trading account</h3>
                    <div className="flex flex-col gap-2">
                        {getAvailableAccounts().map((account) => (
                            <Popover.Close key={account.id} asChild>
                                <button
                                    className={`flex items-center p-2 rounded hover:bg-theme-hover ${
                                        selectedAccountId === account.id ? "bg-theme-secondary" : ""
                                    }`}
                                    onClick={() => {
                                        selectAccount(account.id);
                                        onSelect();
                                    }}
                                >
                                    <div className="w-8 h-8 flex items-center justify-center mr-2">
                                        <CurrencyIcon
                                            currency={account.id}
                                            isVirtual={account.isDemo}
                                        />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-sm font-semibold">
                                            {account.displayName}
                                        </p>
                                        <p className="text-xs text-theme-muted">
                                            {account.accountNumber}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {selectedAccountId === account.id && account.isDemo ? (
                                            <button
                                                className="px-2 py-1 text-xs border border-theme rounded hover:bg-theme-hover"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setBalance("10000", "USD");
                                                }}
                                            >
                                                Reset balance
                                            </button>
                                        ) : (
                                            <p className="text-sm">
                                                {accountType === "demo" ? "10,000" : balance}{" "}
                                                {account.currency}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            </Popover.Close>
                        ))}
                    </div>

                    <div className="w-full h-1 bg-theme-secondary"></div>
                    <div>
                        <div className="flex items-center gap-2 justify-between pb-2">
                            <p className="text-sm text-theme-muted">Total assets</p>
                            <p className="text-sm">
                                {accountType === "demo" ? "10,000" : balance} {currency}
                            </p>
                        </div>
                        <p className="text-xs text-theme-muted">
                            Total assets in your Deriv accounts.
                        </p>
                    </div>

                    <div className="w-full h-1 bg-theme-secondary"></div>
                    <div className="flex justify-end text-sm">
                        <button className="flex items-center gap-2 text-theme" onClick={logout}>
                            <span>Log out</span>
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
