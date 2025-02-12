import React from "react"
import { cn } from "@/lib/utils"
import { useLeftSidebarStore } from "@/stores/leftSidebarStore"
import { X } from "lucide-react"

interface LeftSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  children,
  className,
  ...props
}) => {
  const { isOpen, setLeftSidebar } = useLeftSidebarStore()
  const sidebarRef = React.useRef<HTMLDivElement>(null)

  // Handle escape key press
  React.useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setLeftSidebar(false)
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
        setLeftSidebar(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40",
          isOpen ? "animate-in fade-in-0" : "animate-out fade-out-0"
        )}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-96 transform bg-background shadow-lg",
          "transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "animate-in slide-in-from-left-1/2",
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-xl font-semibold">Markets</h2>
          <button
            onClick={() => setLeftSidebar(false)}
            className="rounded-full p-2 hover:bg-accent hover:text-accent-foreground"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-65px)] overflow-y-auto">{children}</div>
      </div>
    </>
  )
}
