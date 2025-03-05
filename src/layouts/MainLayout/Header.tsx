import React from "react";
import { useOrientationStore } from "@/stores/orientationStore";
import { useClientStore } from "@/stores/clientStore";
// import { AccountSwitcher } from "@/components/AccountSwitcher";
import { BalanceDisplay } from "@/components/BalanceDisplay";

interface HeaderProps {
  className?: string;
  onDeposit?: () => void;
  depositLabel?: string;
  loginUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  className = "",
  onDeposit,
  depositLabel = "Deposit",
  loginUrl = "/login",
}) => {
  const { isLandscape } = useOrientationStore();
  const { isLoggedIn } = useClientStore();
  const showLogo = isLandscape || !isLoggedIn;

  return (
    <header className={`flex items-center gap-4 px-4 py-2 border-b border-opacity-10 text-text-primary ${className}`} id="header">
      {showLogo && (
        <a href="/">
          <img
            src="/logo.png"
            alt="Champion Trader Logo"
            className="w-8 h-8 rounded-full"
          />
        </a>
      )}
      <div
        className={`flex items-center ${
          isLandscape ? "justify-end gap-4" : "justify-end"
        } flex-1`}
      >
        <div className={isLandscape ? "flex items-center gap-4" : "flex-1"}>
          {isLoggedIn && (
            <div className={isLandscape ? "px-4" : ""}>
              {/* <AccountSwitcher /> */}
              <BalanceDisplay />
            </div>
          )}
        </div>
        {isLoggedIn ? (
          <button
            className="px-5 py-2 font-semibold rounded-3xl bg-color-solid-glacier-700 hover:bg-color-solid-glacier-600"
            onClick={onDeposit}
          >
            {depositLabel}
          </button>
        ) : (
          <a
            href={loginUrl}
            className="px-5 py-2 font-semibold rounded-3xl bg-color-solid-glacier-700 hover:bg-color-solid-glacier-600"
          >
            Log in
          </a>
        )}
      </div>
    </header>
  );
};
