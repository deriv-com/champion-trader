import React, { useEffect } from "react";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { useOrientationStore } from "@/stores/orientationStore";
import { useHeaderStore } from "@/stores/headerStore";
import { useBottomNavStore } from "@/stores/bottomNavStore";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
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
  const { isSidebarOpen, setSidebarOpen } = useMainLayoutStore();
  const [isMenuOpen, setMenuOpen] = React.useState(false);
  const isHeaderVisible = useHeaderStore(state => state.isVisible);
  const isBottomNavVisible = useBottomNavStore(state => state.isVisible);

  // Handle menu toggling
  const handleMenuToggle = () => {
    if (isMenuOpen) {
      setMenuOpen(false);
    } else {
      setSidebarOpen(false);
      setMenuOpen(true);
    }
  };

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
      <div className={`flex flex-1 relative ${isDesktop ? "overflow-hidden" : "" }`}>
        {isLandscape && (
          <SideNav 
            setMenuOpen={handleMenuToggle} 
            isMenuOpen={isMenuOpen} 
          />
        )}
        <div className={`flex flex-col ${isSidebarOpen || isMenuOpen ? "w-[100%] ml-auto" : "w-full"} w-[100%] overflow-hidden transition-all duration-300`}>
          {isLandscape && (
            <>
              <div className={`${isSidebarOpen ? "w-[25%] flex-grow" : ""} transition-all duration-300`}>
                <PositionsSidebar 
                  isOpen={isSidebarOpen} 
                  onClose={() => setSidebarOpen(false)} 
                />
              </div>
              <MenuSidebar isOpen={isMenuOpen} onClose={() => setMenuOpen(false)} />
            </>
          )}
          <main className={`flex-1 ${isLandscape ? 'flex flex-row' : 'flex flex-col'}`}>
            {children}
          </main>
          {!isLandscape && isBottomNavVisible && <Footer className="sticky bottom-0 z-50" />}
        </div>
      </div>
    </div>
  );
};
