import React from "react";
import { Clock, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useThemeStore } from "@/stores/themeStore";
import { useClientStore } from "@/stores/clientStore";
import { useOrientationStore } from "@/stores/orientationStore";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";

export const SideNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useClientStore();
  const { isLandscape } = useOrientationStore();
  const { activeSidebar, toggleSidebar, isSideNavVisible } = useMainLayoutStore();

  const { isDarkMode } = useThemeStore();

  const sidebarActiveColor = isDarkMode ? "var(--sidebar-active-dark)" : "var(--sidebar-active-light)";

  return (
    <nav className={`${isLandscape && isSideNavVisible ? 'flex' : 'hidden'} fixed z-[60] flex-col h-[100dvh] sticky top-0 w-16 border-r overflow-y-auto`}>
      <div className="flex flex-col items-center gap-6 py-6">
        {isLoggedIn && (
          <>
            <button
              onClick={() => {
                if (isLandscape) {
                  toggleSidebar('positions');
                } else {
                  navigate('/positions');
                }
              }}
              className={`flex flex-col items-center ${(location.pathname === '/positions') ? 'text-[var(--primary-color)]' : 'text-[var(--text-color)]'}`}
            >
              <div className="rounded-lg p-2" style={{ backgroundColor: activeSidebar === 'positions' ? sidebarActiveColor : "transparent" }}>
                <Clock className="w-5 h-5" />
              </div>
              <span className={`text-xs ${activeSidebar === 'positions' ? "text-[var(--text-color)]" : "text-[var(--text-color)]"}`}>Positions</span>
            </button>
          </>
        )}
        <button
          onClick={() => {
            if (isLandscape) {
              toggleSidebar('menu');
            } else {
              navigate("/menu");
            }
          }}
          className="flex flex-col items-center text-[var(--text-color)]"
        >
          <div className="rounded-lg p-2" style={{ backgroundColor: activeSidebar === 'menu' ? sidebarActiveColor : "transparent" }}>
            <Menu className="w-5 h-5" />
          </div>
          <span className={`text-xs ${activeSidebar === 'menu' ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-300"}`}>Menu</span>
        </button>
      </div>
    </nav>
  );
};
