import React from "react";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, title, children }) => {
    return (
        <div
            className={`absolute h-full w-[320px] bg-theme shadow-lg transform transition-transform duration-300 ease-in-out ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            } z-[51] flex flex-col overflow-hidden`}
        >
            <div className="p-4 flex justify-between items-center">
                <h2 className="text-lg font-bold">{title}</h2>
                <button
                    onClick={onClose}
                    className={`${isOpen ? "text-theme" : "text-theme-muted"} hover:text-theme`}
                >
                    ✕
                </button>
            </div>
            <div className="flex-1 overflow-auto">{children}</div>
        </div>
    );
};

export default Sidebar;
