import React from "react";
import { BarChart2, Clock, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useClientStore } from "@/stores/clientStore";
import { useOrientationStore } from "@/stores/orientationStore";

export const SideNav: React.FC<{ setSidebarOpen: (open: boolean) => void; setMenuOpen: (open: boolean) => void; isMenuOpen: boolean }> = ({ setSidebarOpen, setMenuOpen, isMenuOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useClientStore();
  const { isLandscape } = useOrientationStore();

  return (
    <nav className={`${isLandscape ? 'flex' : 'hidden'} fixed z-[100] flex-col h-[100dvh] sticky top-0 w-16 border-r bg-white overflow-y-auto`}>
      <div className="flex flex-col items-center gap-6 py-6">
        <a href="/" className="pb-4">
          <img
            src="/logo.png"
            alt="Champion Trader Logo"
            className="w-8 h-8 rounded-full"
          />
        </a>
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
                  console.log(setSidebarOpen)
                  setSidebarOpen(true);
                  navigate("/trade");
                } else {
                  navigate('/positions')
                }
              }}
              className={`flex flex-col items-center gap-1 ${location.pathname === '/positions' ? 'text-primary' : 'text-gray-500'
                }`}
            >
              <Clock className="w-5 h-5" />
              <span className="text-xs">Positions</span>
            </button>
          </>
        )}
        <button
          onClick={() => {
            if (window.innerWidth >= 1024) {
              setMenuOpen(!isMenuOpen);
            } else {
              navigate("/menu");
            }
          }}
          className="flex flex-col items-center gap-1 text-gray-500"
        >
          <Menu className="w-5 h-5" />
          <span className="text-xs">Menu</span>
        </button>
      </div>
    </nav>
  );
};
