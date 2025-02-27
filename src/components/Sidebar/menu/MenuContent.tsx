import React from "react";
import { ExternalLink, Home, LogOut, Moon } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";
import { useClientStore } from "@/stores/clientStore";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";

export const MenuContent: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const { isLoggedIn } = useClientStore();
  const logout = useLogout();
  const { setSidebar } = useMainLayoutStore();

  return (
    <div className="p-4 space-y-4">
      <a
        href="https://champion.trade/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between cursor-pointer py-2"
        onClick={() => setSidebar(null)}
      >
        <div className="flex items-center gap-3">
          <Home className="w-5 h-5" />
          <span>Go to Home</span>
        </div>
        <ExternalLink className="w-5 h-5" />
      </a>
      <div className="flex items-center justify-between cursor-pointer py-2">
        <div className="flex items-center gap-3">
          <Moon className="w-5 h-5" />
          <span>Theme</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isDarkMode}
            onChange={() => setIsDarkMode(!isDarkMode)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>
      {isLoggedIn && (
        <button
          className="flex items-center gap-3 cursor-pointer py-2 w-full hover:bg-gray-100"
          onClick={() => {
            logout();
            setSidebar(null);
          }}
        >
          <LogOut className="w-5 h-5" />
          <span>Log out</span>
        </button>
      )}
    </div>
  );
};

export default MenuContent;
