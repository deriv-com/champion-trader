import React, { useEffect, useRef } from "react";
import { ExternalLink, Home, LogOut, Moon } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";
import { useClientStore } from "@/stores/clientStore";

interface MenuSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuSidebar: React.FC<MenuSidebarProps> = ({ isOpen, onClose }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const { isLoggedIn } = useClientStore();
  const logout = useLogout();

  return (
    <div
      className={`fixed left-[64px] h-full w-[20%] bg-white shadow-lg transform transition-all duration-500 ease-in-out ${
        isOpen ? "translate-x-0 opacity-100 " : "-translate-x-full opacity-0"
      } z-[50]`}
      ref={sidebarRef}
    >
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-lg font-bold">Menu</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
          ✕
        </button>
      </div>
      <div className="p-4 space-y-4">
        <a
          href="https://champion.trade/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between cursor-pointer py-2"
        >
          <div className="flex items-center gap-3">
            <Home className="w-5 h-5" />
            <span className="dark:text-white">Go to Home</span>
          </div>
          <ExternalLink className="w-5 h-5" />
        </a>
        <div className="flex items-center justify-between cursor-pointer py-2">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5" />
            <span className="dark:text-white">Theme</span>
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
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
            <span>Log out</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuSidebar;
