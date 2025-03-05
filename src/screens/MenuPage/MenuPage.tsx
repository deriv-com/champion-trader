import React from "react";
import { useNavigate } from "react-router-dom";
import { useClientStore } from "@/stores/clientStore";
import ToggleButton from "@/components/TradeFields/ToggleButton";
import { Home, Moon, LogOut, ExternalLink } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";

export const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useClientStore();
  const logout = useLogout();

  console.log("MenuPage rendered");
  return (
    <div className="flex flex-col flex-1 p-4 text-text-primary-color dark:text-white">
      <h1 className="text-2xl font-bold">Menu</h1>
      <div className="flex flex-col gap-4 mt-4">
<button
  onClick={() => navigate("/trade")}
  className="text-left p-4 rounded-lg hover:bg-background-dark dark:hover:bg-gray-700 border-b border-border-light flex items-center gap-3"
>
          <Home className="w-5 h-5" />
          <span className="text-sm">Go to Home</span>
          <div className="px-3">
            <ExternalLink className="w-5 h-5" />
          </div>
        </button>
        <div className="text-left p-4 rounded-lg hover:bg-background-soft dark:hover:bg-gray-700 border-b border-border-light flex items-center gap-3">
          <Moon className="w-5 h-5" />
          <span className="text-sm peer-checked:text-black">Theme</span>
          <ToggleButton label="" value={false} onChange={() => {}} />
        </div>
        {isLoggedIn && (
          <>
            <button
              onClick={logout}
              className="text-left p-4 rounded-lg hover:bg-background-dark border-b border-gray-200 flex items-center gap-3"
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
