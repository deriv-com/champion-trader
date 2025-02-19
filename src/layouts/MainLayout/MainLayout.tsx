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
      <div className={`flex flex-1 relative ${isDesktop ? "overflow-hidden" : "" }`}>
        {isLandscape && (
          <SideNav isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} setMenuOpen={setMenuOpen} isMenuOpen={isMenuOpen} />
        )}
        <div className="grid flex-1" style={{ gridTemplateColumns: isLandscape ? (isSidebarOpen ? '320px 1fr' : '0 1fr') : '1fr', transition: 'grid-template-columns 300ms' }}>
          {isLandscape && (
            <div className=" overflow-hidden">
              <PositionsSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            </div>
          )}
          <main className={`${isLandscape ? 'flex flex-row' : 'flex flex-col'}`}>
            {children}
          </main>
          {isLandscape && <MenuSidebar isOpen={isMenuOpen} onClose={() => setMenuOpen(false)} />}
          {!isLandscape && isBottomNavVisible && <Footer className="sticky bottom-0 z-50" />}
        </div>
      </div>
    </div>
  );
};
