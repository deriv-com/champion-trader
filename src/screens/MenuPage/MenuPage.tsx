import React from "react";
import { MenuOptions } from "@/components/Menu";

export const MenuPage: React.FC = () => {
    return (
        <div className="flex flex-col gap-4 flex-1 p-4">
            <MenuOptions />
        </div>
    );
};
