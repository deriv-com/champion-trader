import React from "react";
import { ExternalLink, Home, LogOut, Moon } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";
import { useClientStore } from "@/stores/clientStore";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import { useThemeStore } from "@/stores/themeStore";

export const MenuContent: React.FC = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { isLoggedIn } = useClientStore();
  const logout = useLogout();
  const { setSidebar } = useMainLayoutStore();

  return (
    <div className="p-4 space-y-4">
      <a
        href="https://champion.trade/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between cursor-pointer py-2 text-[var(--text-color)]"
        onClick={() => setSidebar(null)}
      >
        <div className="flex items-center gap-3">
          <Home className="w-5 h-5" />
          <span>Go to Home</span>
        </div>
        <ExternalLink className="w-5 h-5" />
      </a>
      <div className="flex items-center justify-between cursor-pointer py-2 text-[var(--text-color)]">
        <div className="flex items-center gap-3">
          <Moon className="w-5 h-5" />
          <span>Theme</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isDarkMode}
            onChange={toggleTheme}
          />
          <div className="w-11 h-6 bg-[var(--background-color)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--primary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-[var(--text-color)] after:border-[var(--text-color)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)] border border-[var(--text-color)]"></div>
        </label>
      </div>
      {isLoggedIn && (
        <button
          className="flex items-center gap-3 cursor-pointer py-2 w-full hover:bg-gray-100 text-[var(--text-color)]"
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
