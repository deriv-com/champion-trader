import React from "react"
import { LeftSidebar } from "@/components/ui/left-sidebar"
import { useMainLayoutStore } from "@/stores/mainLayoutStore"

export const MarketSelector: React.FC = () => {
  const { isOverlaySidebarOpen: isOpen } = useMainLayoutStore()

  // Only render when open to save memory
  if (!isOpen) return null

  return <LeftSidebar />
}
