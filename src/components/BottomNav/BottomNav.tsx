import React from "react";
import { BarChart2, Clock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useClientStore } from "@/stores/clientStore";

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useClientStore();

  if (!isLoggedIn) return null;

  return (
    <nav className="flex items-center justify-around px-4 py-2 border-t bg-white" data-testid="bottom-nav-menu">
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
    </nav>
  );
};
