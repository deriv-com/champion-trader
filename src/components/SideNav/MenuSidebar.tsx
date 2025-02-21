import React, { useEffect, useRef } from "react";
import { useThemeStore } from "@/stores/themeStore";
import { useClientStore } from "@/stores/clientStore";
import { ExternalLink, Home, LogOut, Moon } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";

interface MenuSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuSidebar: React.FC<MenuSidebarProps> = ({ isOpen, onClose }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { logout } = useLogout();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <div
      className={`fixed left-[65px] h-full min-w-[320px] bg-white dark:bg-black !important shadow-lg transform transition-all duration-500 ease-in-out ${isOpen ? "translate-x-0 opacity-100 " : "-translate-x-full opacity-0"
        } z-[50]`}
      ref={sidebarRef}
    >
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-lg font-bold dark:text-white">Menu</h2>
        <button onClick={onClose} className="text-gray-600 dark:text-white hover:text-gray-900 dark:hover:text-gray-300">✕</button>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between cursor-pointer py-2">
          <div className="flex items-center gap-3">
            <Home className="w-5 h-5" />
            <span className="dark:text-white">Go to Home</span>
          </div>
          <ExternalLink className="w-5 h-5" />
        </div>
        <div className="flex items-center justify-between cursor-pointer py-2">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5" />
            <span className="dark:text-white">Theme</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={isDarkMode} onChange={toggleTheme} />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div className="flex items-center gap-3 cursor-pointer py-2" >
          <LogOut 
          onClick={() => logout()} 
          className="w-5 h-5" />
          <span className="dark:text-white">Log out</span>
        </div>
      </div>
    </div>
  );
};

export default MenuSidebar;
