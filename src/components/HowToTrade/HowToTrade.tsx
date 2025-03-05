import React, { useState } from "react";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { GuideModal } from "./GuideModal";
import { ChevronRight } from "lucide-react";
import { TradeType, tradeTypeConfigs } from "@/config/tradeTypes";

type HowToTradeProps = {
    tradeType: TradeType;
};

export const HowToTrade: React.FC<HowToTradeProps> = ({ tradeType }) => {
    const { setBottomSheet } = useBottomSheetStore();
    const { isDesktop } = useDeviceDetection();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        if (isDesktop) {
            setIsModalOpen(true);
        } else {
            setBottomSheet(true, "how-to-trade", "80%", {
                show: true,
                label: "Got it",
                onClick: () => setBottomSheet(false),
            });
        }
    };

    return (
        <>
            <button
                onClick={handleClick}
                className="text-gray-500 hover:text-gray-600 text-sm flex items-center gap-1"
            >
                How to trade{" "}
                {tradeTypeConfigs[tradeType].buttons
                    .map((item) => item.title)
                    .join("/")}
                ?
                <ChevronRight className="w-4 h-4" />
            </button>

            {isDesktop && (
                <GuideModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    type="rise_fall"
                />
            )}
        </>
    );
};

export default HowToTrade;
