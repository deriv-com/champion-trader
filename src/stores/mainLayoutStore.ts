import { create } from 'zustand';

interface MainLayoutStore {
  // Main sidebar (DOM dragging)
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  
  // Overlay sidebar
  isOverlaySidebarOpen: boolean;
  overlaySidebarKey: string | null;
  setOverlaySidebar: (isOpen: boolean, key?: string | null) => void;
}

export const useMainLayoutStore = create<MainLayoutStore>((set) => ({
  // Main sidebar state
  isSidebarOpen: false,
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  
  // Overlay sidebar state
  isOverlaySidebarOpen: false,
  overlaySidebarKey: null,
  setOverlaySidebar: (isOpen, key = null) => set({ isOverlaySidebarOpen: isOpen, overlaySidebarKey: key }),
}));
