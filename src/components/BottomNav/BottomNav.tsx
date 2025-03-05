import React from "react";
import { BarChart2, Clock, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useClientStore } from "@/stores/clientStore";

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useClientStore();

  const handleMenuClick = () => {
    navigate(location.pathname === "/menu" ? "/trade" : "/menu");
  };

  return (
    <nav
      className="flex items-center justify-around px-4 py-2 border-t"
      data-testid="bottom-nav-menu"
    >
      <button
        onClick={() => navigate("/trade")}
className={`flex flex-col items-center gap-1 ${
  location.pathname === "/trade" ? "text-primaryColor" : "text-textPrimaryColor dark:text-white"
}`}
      >
        <BarChart2 className="w-5 h-5" />
        <span className="text-xs">Trade</span>
      </button>
      {isLoggedIn && (
        <button
          onClick={() => navigate("/positions")}
          className={`flex flex-col items-center gap-1 ${
            location.pathname === "/positions" ? "text-primaryColor" : "text-gray-500 dark:text-gray-300"
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-xs">Positions</span>
        </button>
      )}
      <button
        onClick={handleMenuClick}
        className={`flex flex-col items-center gap-1 ${
          location.pathname === "/menu" ? "text-primaryColor" : "text-gray-500 dark:text-gray-300"
        }`}
      >
        <Menu className="w-5 h-5" />
        <span className="text-xs">Menu</span>
      </button>
    </nav>
  );
};
