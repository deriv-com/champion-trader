import React from "react"

interface MarketIconProps {
  type: "volatility" | "boom" | "crash"
  value: string
  isOneSecond?: boolean
}

export const MarketIcon: React.FC<MarketIconProps> = ({ type, value, isOneSecond }) => {
  const renderVolatilityIcon = () => (
    <div className="relative">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="4" fill="#EAF1FF"/>
        <path d="M10 20H14L16 16L20 24L24 16L28 20H30" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {isOneSecond && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1 rounded-full">
            1s
          </div>
        )}
        <text x="50%" y="36" textAnchor="middle" fill="#1E293B" className="text-xs font-medium">
          {value}
        </text>
      </svg>
    </div>
  )

  const renderBoomIcon = () => (
    <div className="relative">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="4" fill="#EAF1FF"/>
        <path d="M10 30L15 25L20 28L25 15L30 20" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M25 20L30 15" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <text x="50%" y="36" textAnchor="middle" fill="#1E293B" className="text-xs font-medium">
          {value}
        </text>
      </svg>
    </div>
  )

  const renderCrashIcon = () => (
    <div className="relative">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="4" fill="#EAF1FF"/>
        <path d="M10 15L15 20L20 17L25 30L30 25" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M25 25L30 30" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <text x="50%" y="36" textAnchor="middle" fill="#1E293B" className="text-xs font-medium">
          {value}
        </text>
      </svg>
    </div>
  )

  switch (type) {
    case "volatility":
      return renderVolatilityIcon()
    case "boom":
      return renderBoomIcon()
    case "crash":
      return renderCrashIcon()
    default:
      return null
  }
}
