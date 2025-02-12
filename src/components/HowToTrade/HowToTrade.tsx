import React, { useState } from "react";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { GuideModal } from "./GuideModal";
import { ChevronRight } from "lucide-react";

export const HowToTrade: React.FC = () => {
  const { setBottomSheet } = useBottomSheetStore();
  const { isDesktop } = useDeviceDetection();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    if (isDesktop) {
      setIsModalOpen(true);
    } else {
      setBottomSheet(true, "how-to-trade", "90%");
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="text-gray-500 hover:text-gray-600 text-sm flex items-center gap-1"
      >
        How to trade Rise/Fall?
        <ChevronRight className="w-4 h-4" />
      </button>

      {isDesktop && (
        <GuideModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          type="rise-fall"
        />
      )}
    </>
  );
};

export default HowToTrade;
