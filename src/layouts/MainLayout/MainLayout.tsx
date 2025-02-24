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
  const [activeTab, setActiveTab] = React.useState<"trade" | "positions" | "menu">("trade");
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const handleSetSidebarOpen = (open: boolean) => {
    setActiveTab(open ? "positions" : activeTab);
    setIsTransitioning(true);
    setTimeout(() => setSidebarOpen(open), 300); // Matches transition duration
  };
  const [isMenuOpen, setMenuOpen] = React.useState(false);

  const handleSetMenuOpen = (open: boolean) => {
    setActiveTab(open ? "menu" : activeTab);
    setIsTransitioning(true);
    setTimeout(() => setMenuOpen(open), 300); // Matches transition duration
  };
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
          <SideNav isSidebarOpen={isSidebarOpen} setSidebarOpen={handleSetSidebarOpen} setMenuOpen={handleSetMenuOpen} isMenuOpen={isMenuOpen} isTransitioning={isTransitioning} activeTab={activeTab} />
        )}
        <div className={`flex flex-col ${isSidebarOpen || isMenuOpen ? "w-[100%] ml-auto" : "w-full"} w-[100%] overflow-hidden transition-all duration-300`}
          onTransitionEnd={() => {
            setIsTransitioning(false);
            setTimeout(() => {
              if (isSidebarOpen) {
                setActiveTab("positions");
              } else if (isMenuOpen) {
                setActiveTab("menu");
              } else {
                setActiveTab("trade");
              }
            }, 10); // Small delay to ensure transition state updates first
          }}>
          {isLandscape && (
            <>
              <div className={`${isSidebarOpen ? "w-[25%] flex-grow" : ""} transition-all duration-300`}>
                <PositionsSidebar isOpen={isSidebarOpen} onClose={() => handleSetSidebarOpen(false)} />
              </div>
              <MenuSidebar isOpen={isMenuOpen} onClose={() => handleSetMenuOpen(false)} />
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
