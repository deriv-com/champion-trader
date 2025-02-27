import React from "react";
import { Clock, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useClientStore } from "@/stores/clientStore";
import { useOrientationStore } from "@/stores/orientationStore";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";

export const SideNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useClientStore();
  const { isLandscape } = useOrientationStore();
  const { activeSidebar, toggleSidebar, isSideNavVisible } = useMainLayoutStore();

  return (
    <nav className={`${isLandscape && isSideNavVisible ? 'flex' : 'hidden'} fixed z-[60] flex-col h-[100dvh] sticky top-0 w-16 border-r bg-white overflow-y-auto`}>
      <div className="flex flex-col items-center gap-6 py-6">
        {isLoggedIn && (
          <>
            <button
              onClick={() => {
                if (isLandscape) {
                  toggleSidebar('positions');
                } else {
                  navigate('/positions')
                }
              }}
              className={`flex flex-col items-center ${(location.pathname === '/positions') ? 'text-primary' : 'text-gray-500'
                }`}
            >
              <div className={`${activeSidebar === 'positions' ? "bg-gray-200 rounded-lg p-2" : "p-2"}`}>
                <Clock className="w-5 h-5" />
              </div>
              <span className={`text-xs ${activeSidebar === 'positions' ? "text-black" : ""}`}>Positions</span>
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
          className="flex flex-col items-center text-gray-500"
        >
          <div className={`${activeSidebar === 'menu' ? "bg-gray-200 rounded-lg p-2" : "p-2"}`}>
            <Menu className="w-5 h-5" />
          </div>
          <span className={`text-xs ${activeSidebar === 'menu' ? "text-black" : "text-gray-500"}`}>Menu</span>
        </button>
      </div>
    </nav>
  );
};
