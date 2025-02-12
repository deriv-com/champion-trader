import { create } from "zustand"

interface LeftSidebarStore {
  isOpen: boolean
  title: string | undefined
  setLeftSidebar: (isOpen: boolean, title?: string) => void
}

export const useLeftSidebarStore = create<LeftSidebarStore>((set) => ({
  isOpen: false,
  title: undefined,
  setLeftSidebar: (isOpen, title) => set({ isOpen, title }),
}))
