import React from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { useClientStore } from "@/stores/clientStore";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import ToggleButton from "@/components/TradeFields/ToggleButton";
import { useLogout } from "@/hooks/useLogout";
import {
    LabelPairedMoonXlRegularIcon,
    LegacyHomeNewIcon,
    LegacyLogout1pxIcon,
    LegacyOpenLink1pxIcon,
} from "@deriv/quill-icons";

// Private subcomponent for menu options
interface MenuOptionProps {
    icon: React.ReactNode; // The icon to display
    name: string; // The text to display
    onClick?: () => void; // Optional click handler
    action?: React.ReactNode; // Optional action component to render on the right side
}

const MenuOption: React.FC<MenuOptionProps> = ({ icon, name, onClick, action }) => {
    // Determine if this should be a button or a div
    const Component = onClick ? "button" : "div";

    return (
        <Component
            className={`h-12 text-left rounded-lg ${action ? "" : "hover:bg-theme-hover"} flex items-center justify-between`}
            onClick={onClick}
        >
            <div className="flex gap-2 items-center">
                {icon}
                <span className="text-sm">{name}</span>
            </div>

            {action && <div>{action}</div>}
        </Component>
    );
};

// Type for menu option configuration
type MenuOptionConfig = {
    icon: React.ReactNode;
    name: string;
    onClick?: () => void;
    action?: React.ReactNode;
    showWhen?: boolean; // Optional condition to control visibility
};

// Function to generate menu options
const getMenuOptions = (
    navigate: NavigateFunction,
    theme: string,
    toggleTheme: () => void,
    logout: () => void,
    isLoggedIn: boolean,
    isSidebar: boolean = false
): MenuOptionConfig[] => {
    return [
        {
            icon: <LegacyHomeNewIcon width={24} fill={theme === "dark" ? "#fff" : "#000"} />,
            name: "Go to Home",
            onClick: isSidebar
                ? () => window.open("https://champion.trade/", "_blank")
                : () => navigate("/trade"),
            action: (
                <LegacyOpenLink1pxIcon iconSize="sm" fill={theme === "dark" ? "#fff" : "#000"} />
            ),
        },
        {
            icon: (
                <LabelPairedMoonXlRegularIcon
                    width={24}
                    fill={theme === "dark" ? "#fff" : "#000"}
                />
            ),
            name: "Theme",
            action: (
                <ToggleButton
                    label=""
                    value={theme === "dark"}
                    onChange={toggleTheme}
                    aria-label="Toggle dark mode"
                />
            ),
        },
        {
            icon: <LegacyLogout1pxIcon width={24} fill={theme === "dark" ? "#fff" : "#000"} />,
            name: "Log out",
            onClick: logout,
            showWhen: isLoggedIn,
        },
    ];
};

interface MenuOptionsProps {
    className?: string;
    isSidebar?: boolean;
}

export const MenuOptions: React.FC<MenuOptionsProps> = ({ className = "", isSidebar = false }) => {
    const navigate = useNavigate();
    const { isLoggedIn } = useClientStore();
    const { theme, toggleTheme, setSidebar } = useMainLayoutStore();
    const logout = useLogout();

    // Create a wrapper for logout function that also closes the sidebar if needed
    const handleLogout = () => {
        logout();
        if (isSidebar) {
            setSidebar(null);
        }
    };

    // Generate menu options
    const options = getMenuOptions(
        navigate,
        theme,
        toggleTheme,
        handleLogout,
        isLoggedIn,
        isSidebar
    );

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {options
                .filter((option) => option.showWhen !== false)
                .map((option, index) => (
                    <MenuOption
                        key={index}
                        icon={option.icon}
                        name={option.name}
                        onClick={option.onClick}
                        action={option.action}
                    />
                ))}
        </div>
    );
};

export default MenuOptions;
