import React from "react";
import { MenuOptions } from "@/components/Menu";

export const MenuPanel: React.FC = () => {
    return (
        <div className="p-4">
            <MenuOptions isSidebar={true} />
        </div>
    );
};

export default MenuPanel;
