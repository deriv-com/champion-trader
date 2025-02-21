import React from "react"
import { useClientStore } from "@/stores/clientStore"
import { LogOut } from "lucide-react"
import { useAccount } from "@/hooks/useAccount"
import { CurrencyIcon } from "@/components/Currency/CurrencyIcon"
import { useLogout } from "@/hooks/useLogout"
import * as Popover from "@radix-ui/react-popover"

interface AccountInfoProps {
  onSelect: () => void
}

export const AccountInfo: React.FC<AccountInfoProps> = ({ onSelect }) => {
  const { balance, currency, setBalance } = useClientStore()
  const {
    accountType,
    selectedAccountId,
    switchAccountType,
    selectAccount,
    getAvailableAccounts,
  } = useAccount()
  const logout = useLogout()

  console.log("AccountInfo render", accountType)

  return (
    <div className="w-full min-w-[280px] bg-white dark:bg-gray-900">
      <div className="flex border-b border-gray-200 text-sm">
        <button
          className={`flex-1 py-2 text-center ${
            accountType === "real"
              ? "font-semibold border-b-2 border-black dark:border-white"
              : "text-gray-500 dark:text-gray-300"
          }`}
          onClick={() => switchAccountType("real")}
        >
          Real
        </button>
        <button
          className={`flex-1 py-2 text-center ${
            accountType === "demo"
              ? "font-semibold border-b-2 border-black"
              : "text-gray-500"
          }`}
          onClick={() => switchAccountType("demo")}
        >
          Demo
        </button>
      </div>

      <div className="p-4">
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-black dark:text-white">Trading account</h3>
          {accountType === "real" || accountType === "demo" ? (
            <div className="flex flex-col gap-2">
              {getAvailableAccounts().map((account) => (
                <button
                  key={account.id}
                  className={`flex items-center p-3 rounded-lg border border-transparent hover:border-gray-400 dark:hover:border-gray-500 ${
                    selectedAccountId === account.id ? "bg-gray-100 dark:bg-gray-700 border-gray-400 dark:border-gray-500" : "border-gray-200 dark:border-gray-600"
                  }`}
                  onClick={() => {
                    selectAccount(account.id)
                    onSelect()
                  }}
                >
                  <div className="w-8 h-8 flex items-center justify-center mr-2">
                    <CurrencyIcon
                      currency={account.id}
                      isVirtual={account.isDemo}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-black dark:text-white">
                      {account.displayName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-300 leading-tight">
                      {account.accountNumber}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedAccountId === account.id && account.isDemo ? (
                      <button
                        className="px-2 py-1 text-xs border border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          setBalance("10000", "USD")
                        }}
                      >
                        Reset balance
                      </button>
                    ) : (
                      <p className="text-sm dark:text-white">
                        {account.isDemo ? "10,000" : balance}{" "}
                        {account.currency}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : null}
          
          <div className="w-full h-1 bg-gray-100 dark:bg-gray-800"></div>
          <div>
            <div className="flex items-center gap-2 justify-between pb-2">
              <p className="text-sm text-gray-500">Total assets</p>
              <p className="text-sm">
                {accountType === "demo" ? "10,000" : balance} {currency}
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Total assets in your Deriv accounts.
            </p>
          </div>

          <div className="w-full h-1 bg-gray-100"></div>
          <div className="flex justify-end text-sm">
            <button
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
              onClick={logout}
            >
              <span className="text-black">Log out</span>
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
