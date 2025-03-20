import React from "react";
import { useClientStore } from "@/stores/clientStore";
import { AccountSwitcher } from "@/components/AccountSwitcher";
// import { BalanceDisplay } from "@/components/BalanceDisplay";

interface HeaderProps {
    className?: string;
    onDeposit?: () => void;
    depositLabel?: string;
    loginUrl?: string;
}

export const ResponsiveHeader: React.FC<HeaderProps> = ({
    className = "",
    onDeposit,
    depositLabel = "Deposit",
    loginUrl = "/login",
}) => {
    const { isLoggedIn } = useClientStore();
    const showLogo = !isLoggedIn;

    return (
        <header
            className={`flex items-center gap-4 px-4 py-2 lg:border-b lg:border-theme bg-theme ${className}`}
            id="header"
        >
            {showLogo && (
                <a href="/">
                    <img
                        src="/logo.svg"
                        alt="Champion Trader Logo"
                        className="w-8 h-8 rounded-full"
                    />
                </a>
            )}
            <div className="flex items-center justify-end flex-1">
                <div className="flex-1">
                    {isLoggedIn && (
                        <div>
                            <AccountSwitcher />
                        </div>
                    )}
                </div>
                {isLoggedIn ? (
                    <button
                        className="text-sm font-semibold rounded-3xl bg-color-brand-700 hover:bg-color-brand-600 text-black flex h-8 min-w-[80px] px-4 justify-center items-center"
                        onClick={onDeposit}
                    >
                        {depositLabel}
                    </button>
                ) : (
                    <a
                        href={loginUrl}
                        className="text-sm font-semibold rounded-3xl bg-color-brand-700 hover:bg-color-brand-600 text-black flex h-8 min-w-[80px] px-4 justify-center items-center"
                    >
                        Log in
                    </a>
                )}
            </div>
        </header>
    );
};
