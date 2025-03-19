import React from "react";
import { BarChart2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useClientStore } from "@/stores/clientStore";
import {
    LabelPairedClockThreeXlBoldIcon,
    LabelPairedClockThreeXlFillIcon,
    LegacyMenuHamburger1pxIcon,
    LegacyMenuHamburger2pxIcon,
} from "@deriv/quill-icons";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";

export const BottomNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn } = useClientStore();
    const { theme } = useMainLayoutStore();

    const handleMenuClick = () => {
        navigate(location.pathname === "/menu" ? "/trade" : "/menu");
    };

    return (
        <nav
            className="flex items-center justify-around px-4 py-2 border-t border-theme bg-theme"
            data-testid="bottom-nav-menu"
        >
            <button onClick={() => navigate("/trade")} className="flex flex-col items-center gap-1">
                <BarChart2
                    className="w-5 h-5"
                    strokeWidth={location.pathname === "/trade" ? 4 : 2}
                />
                <span className="text-xs">Trade</span>
            </button>
            {isLoggedIn && (
                <button
                    onClick={() => navigate("/positions")}
                    className="flex flex-col items-center gap-1"
                >
                    {location.pathname === "/positions" ? (
                        <LabelPairedClockThreeXlFillIcon
                            width={24}
                            height={24}
                            fill={theme === "dark" ? "#fff" : "#000"}
                        />
                    ) : (
                        <LabelPairedClockThreeXlBoldIcon
                            width={24}
                            height={24}
                            fill={theme === "dark" ? "#fff" : "#000"}
                        />
                    )}
                    <span className="text-xs">Positions</span>
                </button>
            )}
            <button onClick={handleMenuClick} className="flex flex-col items-center gap-1">
                {location.pathname === "/menu" ? (
                    <LegacyMenuHamburger2pxIcon
                        iconSize="sm"
                        fill={theme === "dark" ? "#fff" : "#000"}
                    />
                ) : (
                    <LegacyMenuHamburger1pxIcon
                        iconSize="sm"
                        fill={theme === "dark" ? "#fff" : "#000"}
                    />
                )}
                <span className="text-xs">Menu</span>
            </button>
        </nav>
    );
};
