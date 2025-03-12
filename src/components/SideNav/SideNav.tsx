import React from "react";
import { Clock, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useClientStore } from "@/stores/clientStore";
import { useOrientationStore } from "@/stores/orientationStore";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";

export const SideNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn } = useClientStore();
    const { isLandscape } = useOrientationStore();
    const { activeSidebar, toggleSidebar, isSideNavVisible } = useMainLayoutStore();

    return (
        <nav
            className={`${isLandscape && isSideNavVisible ? "flex" : "hidden"} fixed z-[60] flex-col h-[100dvh] sticky top-0 w-16 border-r border-theme bg-theme overflow-y-auto`}
        >
            <div className="flex flex-col items-center gap-8 py-4">
                <a href="/" className="">
                    <img
                        src="/logo.svg"
                        alt="Champion Trader Logo"
                        className="w-8 h-8 rounded-full"
                    />
                </a>
                <div className="flex flex-col gap-4">
                    {isLoggedIn && (
                        <button
                            onClick={() => {
                                if (isLandscape) {
                                    toggleSidebar("positions");
                                } else {
                                    navigate("/positions");
                                }
                            }}
                            className={`flex flex-col items-center ${
                                location.pathname === "/positions"
                                    ? "text-primary"
                                    : "text-theme-muted"
                            }`}
                        >
                            <div
                                className={`${activeSidebar === "positions" ? "bg-theme-active rounded-lg p-2" : "p-2"}`}
                            >
                                <Clock className="w-5 h-5" />
                            </div>
                            <span
                                className={`text-xs ${activeSidebar === "positions" ? "text-theme" : ""}`}
                            >
                                Positions
                            </span>
                        </button>
                    )}
                    <button
                        onClick={() => {
                            if (isLandscape) {
                                toggleSidebar("menu");
                            } else {
                                navigate("/menu");
                            }
                        }}
                        className="flex flex-col items-center  text-theme-muted"
                    >
                        <div
                            className={`${
                                activeSidebar === "menu" ? "bg-gray-200 rounded-lg p-2" : "p-2"
                            }`}
                        >
                            <Menu className="w-5 h-5" />
                        </div>
                        <span
                            className={`text-xs ${
                                activeSidebar === "menu" ? "text-theme" : "text-theme-muted"
                            }`}
                        >
                            Menu
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    );
};
