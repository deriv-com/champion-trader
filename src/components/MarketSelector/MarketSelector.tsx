import React from "react"
import { LeftSidebar } from "@/components/ui/left-sidebar"
import { useLeftSidebarStore } from "@/stores/leftSidebarStore"

export const MarketSelector: React.FC = () => {
  const { isOpen } = useLeftSidebarStore()

  // Only render when open to save memory
  if (!isOpen) return null

  return <LeftSidebar />
}
