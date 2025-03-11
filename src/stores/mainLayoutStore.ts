import { create } from "zustand";

type SidebarContent = "positions" | "menu" | null;

interface MainLayoutStore {
    // Sidebar state
    activeSidebar: SidebarContent;
    setSidebar: (content: SidebarContent) => void;
    toggleSidebar: (content: SidebarContent) => void;

    // Overlay sidebar
    isOverlaySidebarOpen: boolean;
    overlaySidebarKey: string | null;
    setOverlaySidebar: (isOpen: boolean, key?: string | null) => void;

    // SideNav visibility
    isSideNavVisible: boolean;
    setSideNavVisible: (isVisible: boolean) => void;
}

export const useMainLayoutStore = create<MainLayoutStore>((set, get) => ({
    // SideNav state
    isSideNavVisible: true,
    setSideNavVisible: (isVisible) => set({ isSideNavVisible: isVisible }),

    // Sidebar state
    activeSidebar: null,
    setSidebar: (content) => set({ activeSidebar: content }),
    toggleSidebar: (content) => {
        const { activeSidebar } = get();
        if (activeSidebar === content) {
            set({ activeSidebar: null });
        } else {
            set({ activeSidebar: content });
        }
    },

    // Overlay sidebar state
    isOverlaySidebarOpen: false,
    overlaySidebarKey: null,
    setOverlaySidebar: (isOpen, key = null) =>
        set({ isOverlaySidebarOpen: isOpen, overlaySidebarKey: key }),
}));
