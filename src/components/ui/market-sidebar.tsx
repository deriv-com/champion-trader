import React from "react"
import { cn } from "@/lib/utils"
import { useThemeStore } from "@/stores/themeStore"
import { useMainLayoutStore } from "@/stores/mainLayoutStore"
import { marketSidebarConfig } from "@/config/marketSidebarConfig"

export const MarketSidebar: React.FC = () => {
  const { isOverlaySidebarOpen: isOpen, overlaySidebarKey: key, setOverlaySidebar } = useMainLayoutStore()
  const sidebarRef = React.useRef<HTMLDivElement>(null)

  // Handle escape key press
  React.useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setOverlaySidebar(false)
      }
    }

    document.addEventListener("keydown", handleEscapeKey)
    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isOpen])

  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setOverlaySidebar(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const { isDarkMode } = useThemeStore();

  if (!isOpen || !key || !marketSidebarConfig[key]) return null

  const { body } = marketSidebarConfig[key]

  const sidebarActiveColor = isDarkMode ? "bg-background-dark" : "bg-border-light";

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-50",
          isOpen ? "animate-in fade-in-0" : "animate-out fade-out-0"
        )}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={cn(
          "fixed left-0 top-0 z-[101] h-full w-96 transform text-text-primary dark:text-white shadow-lg",
          "transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          sidebarActiveColor
        )}>
        {/* Content */}
        <div className="h-[100%] overflow-y-auto">{body}</div>
      </div>
    </>
  )
}
