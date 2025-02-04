import React from "react";
import { BottomNav } from "@/components/BottomNav";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t landscape:hidden">
      <BottomNav />
    </footer>
  );
};
