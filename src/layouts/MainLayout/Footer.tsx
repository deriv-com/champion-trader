import React from "react";
import { BottomNav } from "@/components/BottomNav";

interface FooterProps {
    className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = "" }) => {
    return (
        <footer className={`border-t border-theme ${className}`}>
            <BottomNav />
        </footer>
    );
};
