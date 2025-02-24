import React from "react";
import { BarChart2, Clock, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useClientStore } from "@/stores/clientStore";
import { useOrientationStore } from "@/stores/orientationStore";

export const SideNav: React.FC<{ setSidebarOpen: (open: boolean) => void; setMenuOpen: (open: boolean) => void; isMenuOpen: boolean, isSidebarOpen: boolean, isTransitioning: boolean, activeTab: "trade" | "positions" | "menu" }> = ({ setSidebarOpen, setMenuOpen, isMenuOpen, isSidebarOpen, isTransitioning, activeTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useClientStore();
  const { isLandscape } = useOrientationStore();

  console.log(isTransitioning, 'test')

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
          className={`flex flex-col items-center ${location.pathname === "/trade" ? "text-primary" : "text-gray-500"
            }`}
        >
          <div className={`${activeTab === "trade" ? "bg-gray-200 rounded-lg p-2" : "p-2"}`}>
            <BarChart2 className="w-5 h-5" />
          </div>
          <span className={`text-xs ${(!isSidebarOpen && !isMenuOpen && !isTransitioning) ? "text-black" : "text-gray-500"}`}>Trade</span>
        </button>
        {isLoggedIn && (
          <>
            <button
              onClick={() => {
                if (window.innerWidth >= 1024) {
                  setSidebarOpen(true);
                  setMenuOpen(false);
                } else {
                  navigate('/positions')
                }
              }}
              className={`flex flex-col items-center ${(location.pathname === '/positions' && !isTransitioning) ? 'text-primary' : 'text-gray-500'
                }`}
              disabled={isSidebarOpen}
            >
              <div className={`${isSidebarOpen && !isTransitioning ? "bg-gray-200 rounded-lg p-2" : "p-2"}`}>
                <Clock className="w-5 h-5" />
              </div>
              <span className={`text-xs ${isSidebarOpen && !isTransitioning ? "text-black" : ""}`}>Positions</span>
            </button>
          </>
        )}
        <button
          onClick={() => {
            if (window.innerWidth >= 1024) {
              setMenuOpen(!isMenuOpen);
              setSidebarOpen(false);
            } else {
              navigate("/menu");
            }
          }}
          disabled={isMenuOpen}
          className="flex flex-col items-center text-gray-500"
        >
          <div className={`${isMenuOpen && !isTransitioning ? "bg-gray-200 rounded-lg p-2" : "p-2"}`}>
            <Menu className="w-5 h-5" />
          </div>
          <span className={`text-xs ${activeTab === "menu" && !isTransitioning ? "text-black" : "text-gray-500"}`}>Menu</span>
        </button>
      </div>
    </nav>
  );
};
