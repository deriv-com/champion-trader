import React from "react";
import { useNavigate } from "react-router-dom";
import { useClientStore } from "@/stores/clientStore";
import ToggleButton from "@/components/TradeFields/ToggleButton";
import { Home, Moon, LogOut, ExternalLink } from "lucide-react";

export const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout, isLoggedIn } = useClientStore();

  const handleLogout = () => {
    localStorage.removeItem("loginToken");
    logout();
    navigate("/trade");
  };

  return (
    <div className="flex flex-col flex-1 p-4">
      <h1 className="text-2xl font-bold">Menu</h1>
      <div className="flex flex-col gap-4 mt-4">
        <button
          onClick={() => navigate("/trade")}
          className="text-left p-4 rounded-lg hover:bg-gray-100 border-b border-gray-200 flex items-center gap-3"
        >
          <Home className="w-5 h-5" />
          <span className="text-sm">Go to Home</span>
          <div className="px-3">
            <ExternalLink className="w-5 h-5" />
          </div>
        </button>
        <div className="text-left p-4 rounded-lg hover:bg-gray-100 border-b border-gray-200 flex items-center gap-3">
          <Moon className="w-5 h-5" />
          <span className="text-sm">Theme</span>
          <ToggleButton
            label=""
            value={false}
            onChange={() => {}}
          />
        </div>
        {isLoggedIn && (
          <>
            <button
              onClick={handleLogout}
              className="text-left p-4 rounded-lg hover:bg-gray-100 border-b border-gray-200 flex items-center gap-3"
            >
              <LogOut className="w-5 h-5" />
              Log out
            </button>
          </>
        )}
      </div>
    </div>
  );
};
