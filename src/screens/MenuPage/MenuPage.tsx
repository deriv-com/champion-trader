import React from "react";
import { useNavigate } from "react-router-dom";
import { useClientStore } from "@/stores/clientStore";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import ToggleButton from "@/components/TradeFields/ToggleButton";
import { Home, Moon, LogOut, ExternalLink } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";

export const MenuPage: React.FC = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useClientStore();
    const { theme, toggleTheme } = useMainLayoutStore();
    const logout = useLogout();

    return (
        <div className="flex flex-col flex-1 p-4">
            <h1 className="text-2xl font-bold">Menu</h1>
            <div className="flex flex-col gap-4 mt-4">
                <button
                    onClick={() => navigate("/trade")}
                    className="text-left p-4 rounded-lg hover:bg-theme-hover border-b border-theme flex items-center gap-3"
                >
                    <Home className="w-5 h-5" />
                    <span className="text-sm">Go to Home</span>
                    <div className="px-3">
                        <ExternalLink className="w-5 h-5" />
                    </div>
                </button>
                <div className="text-left p-4 rounded-lg hover:bg-theme-hover border-b border-theme flex items-center gap-3">
                    <Moon className="w-5 h-5" />
                    <span className="text-sm">Theme</span>
                    <ToggleButton
                        label=""
                        value={theme === "dark"}
                        onChange={toggleTheme}
                        aria-label="Toggle dark mode"
                    />
                </div>
                {isLoggedIn && (
                    <>
                        <button
                            onClick={logout}
                            className="text-left p-4 rounded-lg hover:bg-theme-hover border-b border-theme flex items-center gap-3"
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
