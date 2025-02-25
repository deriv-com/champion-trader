import React from "react";
import { Clock, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useClientStore } from "@/stores/clientStore";
import { useOrientationStore } from "@/stores/orientationStore";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";

export const SideNav: React.FC<{ setMenuOpen: (open: boolean) => void; isMenuOpen: boolean }> = ({ setMenuOpen, isMenuOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useClientStore();
  const { isLandscape } = useOrientationStore();
  const { isSidebarOpen, setSidebarOpen, isSideNavVisible } = useMainLayoutStore();

  return (
    <nav className={`${isLandscape && isSideNavVisible ? 'flex' : 'hidden'} fixed z-[60] flex-col h-[100dvh] sticky top-0 w-16 border-r bg-white overflow-y-auto`}>
      <div className="flex flex-col items-center gap-6 py-6">
        {isLoggedIn && (
          <>
            <button
              onClick={() => {
                if (window.innerWidth >= 1024) {
                  setMenuOpen(false)
                  setSidebarOpen(true);
                } else {
                  navigate('/positions')
                }
              }}
              className={`flex flex-col items-center ${(location.pathname === '/positions') ? 'text-primary' : 'text-gray-500'
                }`}
              disabled={isSidebarOpen}
            >
              <div className={`${isSidebarOpen ? "bg-gray-200 rounded-lg p-2" : "p-2"}`}>
                <Clock className="w-5 h-5" />
              </div>
              <span className={`text-xs ${isSidebarOpen ? "text-black" : ""}`}>Positions</span>
            </button>
          </>
        )}
        <button
          onClick={() => {
            if (window.innerWidth >= 1024) {
              setSidebarOpen(false);
              setMenuOpen(!isMenuOpen);
            } else {
              navigate("/menu");
            }
          }}
          disabled={isMenuOpen}
          className="flex flex-col items-center text-gray-500"
        >
          <div className={`${isMenuOpen ? "bg-gray-200 rounded-lg p-2" : "p-2"}`}>
            <Menu className="w-5 h-5" />
          </div>
          <span className={`text-xs ${isMenuOpen ? "text-black" : "text-gray-500"}`}>Menu</span>
        </button>
      </div>
    </nav>
  );
};
