import React from "react";
import { BarChart2, Clock, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useClientStore } from "@/stores/clientStore";

export const SideNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useClientStore();

  const handleMenuClick = () => {
    navigate(location.pathname === '/menu' ? '/trade' : '/menu');
  };

  return (
    <nav className="hidden landscape:flex flex-col h-[100dvh] sticky top-0 w-16 border-r bg-white overflow-y-auto">
      <div className="flex flex-col items-center gap-6 py-6">
        {isLoggedIn && (
          <>
            <button 
              onClick={() => navigate('/trade')}
              className={`flex flex-col items-center gap-1 ${
                location.pathname === '/trade' ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <BarChart2 className="w-5 h-5" />
              <span className="text-xs">Trade</span>
            </button>
            <button 
              onClick={() => navigate('/positions')}
              className={`flex flex-col items-center gap-1 ${
                location.pathname === '/positions' ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="text-xs">Positions</span>
            </button>
          </>
        )}
        <button 
          onClick={handleMenuClick}
          className={`flex flex-col items-center gap-1 ${
            location.pathname === '/menu' ? 'text-primary' : 'text-gray-500'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-xs">Menu</span>
        </button>
      </div>
    </nav>
  );
};
