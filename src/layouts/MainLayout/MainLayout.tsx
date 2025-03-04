import React, { useEffect } from "react";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { useOrientationStore } from "@/stores/orientationStore";
import { useBottomNavStore } from "@/stores/bottomNavStore";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import { Footer } from "./Footer";
import { ResponsiveHeader } from "./ResponsiveHeader";
import { SideNav } from "@/components/SideNav";
import { Sidebar, MenuContent, PositionsContent } from "@/components/Sidebar";

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { isMobile } = useDeviceDetection();
    const { isLandscape, setIsLandscape } = useOrientationStore();
    const { activeSidebar, setSidebar } = useMainLayoutStore();
    const isBottomNavVisible = useBottomNavStore((state) => state.isVisible);

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
            window.removeEventListener(
                "orientationchange",
                handleOrientationChange
            );
            window.removeEventListener("resize", handleOrientationChange);
        };
    }, [isMobile, isLandscape]);

    const shouldEnableScrolling = isLandscape && window.innerHeight < 500;

    return (
        <div className="min-h-[100dvh] h-[100dvh] flex flex-col">
            {isMobile && (
                <ResponsiveHeader
                    className={`${
                        shouldEnableScrolling ? "" : "sticky top-0"
                    } z-50 w-full`}
                />
            )}
            <div
                className={`flex flex-1 relative ${
                    isLandscape && !shouldEnableScrolling
                        ? "overflow-hidden"
                        : ""
                }`}
            >
                {isLandscape && <SideNav />}
                <div className="flex flex-1 overflow-hidden">
                    {isLandscape ? (
                        <div className="flex flex-1">
                            <div className="relative z-[50]">
                                <Sidebar
                                    isOpen={activeSidebar === "positions"}
                                    onClose={() => setSidebar(null)}
                                    title="Positions"
                                >
                                    <PositionsContent />
                                </Sidebar>
                                <Sidebar
                                    isOpen={activeSidebar === "menu"}
                                    onClose={() => setSidebar(null)}
                                    title="Menu"
                                >
                                    <MenuContent />
                                </Sidebar>
                            </div>
                            <main className="flex-1 flex flex-row transition-all duration-300">
                                {children}
                            </main>
                        </div>
                    ) : (
                        <main className="flex-1 flex flex-col">
                            {children}
                            {isBottomNavVisible && (
                                <Footer className="sticky bottom-0 z-50" />
                            )}
                        </main>
                    )}
                </div>
            </div>
        </div>
    );
};
