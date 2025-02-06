import React, { useEffect } from "react";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { useOrientationStore } from "@/stores/orientationStore";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SideNav } from "@/components/SideNav";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isMobile } = useDeviceDetection();
  const { isLandscape, setIsLandscape } = useOrientationStore();

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
    <div className="flex min-h-[100dvh] h-[100dvh]">
      <SideNav />
      <div className="flex flex-col flex-1 relative overflow-hidden">
        <Header className="sticky top-0 z-50" />
        <main className={`flex-1 ${isLandscape ? 'flex flex-row' : 'flex flex-col'}`}>
          {children}
        </main>
        {!isLandscape && <Footer />}
      </div>
    </div>
  );
};
