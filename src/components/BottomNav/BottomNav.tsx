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

export const BottomNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn } = useClientStore();

    const handleMenuClick = () => {
        navigate(location.pathname === "/menu" ? "/trade" : "/menu");
    };

    return (
        <nav
            className="flex items-center justify-around px-4 py-2 border-t bg-white"
            data-testid="bottom-nav-menu"
        >
            <button
                onClick={() => navigate("/trade")}
                className={`flex flex-col items-center gap-1 ${
                    location.pathname === "/trade" ? "text-primary" : "text-gray-500"
                }`}
            >
                <BarChart2
                    className="w-5 h-5"
                    strokeWidth={location.pathname === "/trade" ? 4 : 2}
                />
                <span className="text-xs">Trade</span>
            </button>
            {isLoggedIn && (
                <button
                    onClick={() => navigate("/positions")}
                    className={`flex flex-col items-center gap-1 ${
                        location.pathname === "/positions" ? "text-primary" : "text-gray-500"
                    }`}
                >
                    {location.pathname === "/positions" ? (
                        <LabelPairedClockThreeXlFillIcon width={24} height={24} />
                    ) : (
                        <LabelPairedClockThreeXlBoldIcon width={24} height={24} />
                    )}
                    <span className="text-xs">Positions</span>
                </button>
            )}
            <button
                onClick={handleMenuClick}
                className={`flex flex-col items-center gap-1 ${
                    location.pathname === "/menu" ? "text-primary" : "text-gray-500"
                }`}
            >
                {location.pathname === "/menu" ? (
                    <LegacyMenuHamburger2pxIcon fill="#000000" iconSize="sm" />
                ) : (
                    <LegacyMenuHamburger1pxIcon fill="#000000" iconSize="sm" />
                )}
                <span className="text-xs">Menu</span>
            </button>
        </nav>
    );
};
