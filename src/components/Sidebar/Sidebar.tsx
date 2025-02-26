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
      className={`fixed left-[65px] h-full w-[320px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-[calc(100%+65px)]"
      } z-[51] flex flex-col overflow-hidden`}
    >
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-lg font-bold">{title}</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">✕</button>
      </div>
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
