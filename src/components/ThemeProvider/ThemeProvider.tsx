import { useEffect } from "react";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";

export const ThemeProvider: React.FC = () => {
    const { theme } = useMainLayoutStore();

    useEffect(() => {
        // Apply theme class to document element
        const root = window.document.documentElement;

        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, [theme]);

    return null;
};
