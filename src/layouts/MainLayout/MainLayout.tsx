import React, { useEffect } from "react";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { useOrientationStore } from "@/stores/orientationStore";
import { useHeaderStore } from "@/stores/headerStore";
import { useBottomNavStore } from "@/stores/bottomNavStore";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SideNav } from "@/components/SideNav";
import PositionsSidebar from "@/components/PositionsSidebar/PositionsSidebar";
import MenuSidebar from "@/components/SideNav/MenuSidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isMobile, isDesktop } = useDeviceDetection();
  const { isLandscape, setIsLandscape } = useOrientationStore();
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const [isMenuOpen, setMenuOpen] = React.useState(false);
  const isHeaderVisible = useHeaderStore(state => state.isVisible);
  const isBottomNavVisible = useBottomNavStore(state => state.isVisible);

  useEffect(() => {
    const handleOrientationChange = () => {
      const isLandscapeMode = window.matchMedia
        ? window.matchMedia("(orientation: landscape)").matches
        : window.innerWidth > window.innerHeight;
      setIsLandscape(isLandscapeMode);
    };

    handleOrientationChange();
    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("resize", handleOrientationChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, [isMobile, isLandscape]);

  return (
    <div className="min-h-[100dvh] h-[100dvh] flex flex-col">
      {isHeaderVisible && (
        <Header className="sticky top-0 z-50 w-full" />
      )}
      <div className={`flex flex-1 relative ${isDesktop ? "overflow-hidden" : ""}`}>
        {isLandscape && (
          <SideNav isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} setMenuOpen={setMenuOpen} isMenuOpen={isMenuOpen} />
        )}
        <div className="flex flex-1 overflow-hidden">
          {isLandscape ? (
            <div className="flex flex-1">
              <div className={`${isSidebarOpen ? "w-[22%]" : "w-0"} transition-all duration-300 flex-shrink-0`}>
                <PositionsSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
              </div>
              <div className={`${isMenuOpen ? "w-[22%]" : "w-0"} transition-all duration-300 flex-shrink-0`}>
                <MenuSidebar isOpen={isMenuOpen} onClose={() => setMenuOpen(false)} />
              </div>
              <main className="flex-1 flex flex-row transition-all duration-300">
                {children}
              </main>
            </div>
          ) : (
            <main className="flex-1 flex flex-col">
              {children}
              {isBottomNavVisible && <Footer className="sticky bottom-0 z-50" />}
            </main>
          )}
        </div>
      </div>
    </div>
  );
};
