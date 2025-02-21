import React from "react";
import { BarChart2, Clock, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useClientStore } from "@/stores/clientStore";
import { useOrientationStore } from "@/stores/orientationStore";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";

export const SideNav: React.FC<{ setMenuOpen: (open: boolean) => void; isMenuOpen: boolean }> = ({ setMenuOpen, isMenuOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useClientStore();
  const { isLandscape } = useOrientationStore();
  const { isSidebarOpen, setSidebarOpen } = useMainLayoutStore();

  return (
    <nav className={`${isLandscape ? 'flex' : 'hidden'} fixed z-[100] flex-col h-[100dvh] sticky top-0 w-16 border-r bg-white overflow-y-auto`}>
      <div className="flex flex-col items-center gap-6 py-6">
        <button
          onClick={() => {
            if (window.innerWidth >= 1024) {
              setSidebarOpen(false);
            }
            navigate("/trade");
          }}
          className={`flex flex-col items-center gap-1 ${location.pathname === "/trade" ? "text-primary" : "text-gray-500"
            }`}
        >
          <BarChart2 className="w-5 h-5" />
          <span className="text-xs">Trade</span>
        </button>
        {isLoggedIn && (
          <>
            <button
              onClick={() => {
                if (window.innerWidth >= 1024) {
                  setMenuOpen(false)
                  setSidebarOpen(true);
                  navigate("/trade");
                } else {
                  navigate('/positions')
                }
              }}
              className={`flex flex-col items-center gap-1 ${location.pathname === '/positions' ? 'text-primary' : 'text-gray-500'
                }`}
              disabled={isSidebarOpen}
            >
              <Clock className="w-5 h-5" />
              <span className="text-xs">Positions</span>
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
          className="flex flex-col items-center gap-1 text-gray-500"
        >
          <Menu className="w-5 h-5" />
          <span className="text-xs">Menu</span>
        </button>
      </div>
    </nav>
  );
};
