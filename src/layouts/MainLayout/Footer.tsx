import React from "react";
import { BottomNav } from "@/components/BottomNav";
import { useOrientationStore } from "@/stores/orientationStore";

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const { isLandscape } = useOrientationStore();

  return (
    <footer className={`border-t ${!isLandscape ? 'block' : 'hidden'} ${className}`}>
      <BottomNav />
    </footer>
  );
};
