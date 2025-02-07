import React from "react"
import { ChevronDown, CandlestickChart } from "lucide-react"
import { useBottomSheetStore } from "@/stores/bottomSheetStore"

interface MarketSelectorButtonProps {
  symbol: string
  price: string
}

interface FormattedSymbol {
  number: string
  isOneSecond: boolean
  displayName: string
  isForex: boolean
  isClosed: boolean
}

export const MarketSelectorButton: React.FC<MarketSelectorButtonProps> = ({
  symbol,
  price,
}) => {
  const formatSymbol = (symbol: string): FormattedSymbol => {
    const isOneSecond = symbol.startsWith("1HZ")
    const isForex = !symbol.includes("HZ") && !symbol.includes("R_")

    let number: string
    let displayName: string

    if (isForex) {
      const base = symbol.slice(0, 3)
      const quote = symbol.slice(3)
      number = base
      displayName = `${base}/${quote}`
    } else {
      number = isOneSecond
        ? symbol.replace("1HZ", "").replace("V", "")
        : symbol.replace("R_", "")
      displayName = `Volatility ${number}${isOneSecond ? " (1s)" : ""} Index`
    }

    return {
      number,
      isOneSecond,
      displayName,
      isForex,
      // Dummy closed state for demo
      isClosed: symbol === 'USDJPY'
    }
  }

  const { number, isOneSecond, displayName, isForex, isClosed } = formatSymbol(symbol)
  const { setBottomSheet } = useBottomSheetStore()

  const handleClick = () => {
    setBottomSheet(true, "market-info", "87%")
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-3 px-4 py-3 bg-muted/50 hover:bg-muted/70 rounded-lg transition-colors"
    >
      <div className="relative">
        <div className="w-[52px] h-[52px] bg-[#EAF1FF] rounded-lg flex items-center justify-center gap-1">
          <CandlestickChart className="w-4 h-4" />
          <span className={`font-semibold ${isForex ? 'text-sm' : 'text-lg'}`}>{number}</span>
        </div>
        {isOneSecond && (
          <div className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] px-1 py-0.5 rounded">
            1s
          </div>
        )}
      </div>
      <div className="flex flex-col items-start">
        <div className="flex items-center gap-2">
          <span className="text-base font-medium">{displayName}</span>
          {isClosed && (
            <span className="text-[10px] px-1.5 py-0.5 bg-rose-500/10 rounded-full text-rose-500">
              Closed
            </span>
          )}
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </div>
        <span className="text-lg font-semibold">{price}</span>
      </div>
    </button>
  )
}
