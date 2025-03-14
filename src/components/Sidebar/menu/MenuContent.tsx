import React from "react";
import { ExternalLink, Home, LogOut, Moon } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";
import { useClientStore } from "@/stores/clientStore";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import ToggleButton from "@/components/TradeFields/ToggleButton";

export const MenuContent: React.FC = () => {
    const { isLoggedIn } = useClientStore();
    const logout = useLogout();
    const { setSidebar, theme, toggleTheme } = useMainLayoutStore();

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
                <ToggleButton
                    label=""
                    value={theme === "dark"}
                    onChange={toggleTheme}
                    aria-label="Toggle dark mode"
                />
            </div>
            {isLoggedIn && (
                <button
                    className="flex items-center gap-3 cursor-pointer py-2 w-full hover:bg-theme-hover"
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
