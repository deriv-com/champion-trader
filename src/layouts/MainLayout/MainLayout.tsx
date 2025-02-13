import React, { useEffect } from "react";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { useOrientationStore } from "@/stores/orientationStore";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SideNav } from "@/components/SideNav";
import PositionsSidebar from "@/components/PositionsSidebar/PositionsSidebar";
import MenuSidebar from "@/components/SideNav/MenuSidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isMobile } = useDeviceDetection();
  const { isLandscape, setIsLandscape } = useOrientationStore();
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const [isMenuOpen, setMenuOpen] = React.useState(false);

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
    <div className="flex min-h-[100dvh] h-[100dvh] relative">
      <SideNav setSidebarOpen={setSidebarOpen} setMenuOpen={setMenuOpen} isMenuOpen={isMenuOpen} />
      <div className={`flex flex-col ${isSidebarOpen || isMenuOpen ? "w-[75%] ml-auto" : "w-full"} overflow-hidden transition-all duration-300`}>
        <Header className="sticky top-0 z-50" />
        <div className={`${isSidebarOpen ? "w-[25%] flex-grow" : "hidden"} transition-all duration-300`}>
          <PositionsSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
        <MenuSidebar isOpen={isMenuOpen} onClose={() => setMenuOpen(false)} />
        <main className={`flex-1 ${isLandscape ? 'flex flex-row' : 'flex flex-col'}`}>
          {children}
        </main>
        {!isLandscape && <Footer className="sticky bottom-0 z-50" />}
      </div>
    </div>
  );
};
