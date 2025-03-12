import { create } from "zustand";
import { persist } from "zustand/middleware";

type SidebarContent = "positions" | "menu" | null;
type Theme = "dark" | "light";

interface MainLayoutStore {
    // Theme state
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;

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

export const useMainLayoutStore = create<MainLayoutStore>()(
    persist(
        (set, get) => ({
            // Theme state
            theme: "light", // Default to light theme
            toggleTheme: () =>
                set((state) => ({
                    theme: state.theme === "light" ? "dark" : "light",
                })),
            setTheme: (theme: Theme) => set({ theme }),

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
        }),
        {
            name: "main-layout-storage", // localStorage key
            partialize: (state) => ({ theme: state.theme }), // Only persist theme
        }
    )
);
