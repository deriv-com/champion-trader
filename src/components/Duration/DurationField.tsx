import React, { useState, useRef } from "react";
import { useTradeStore } from "@/stores/tradeStore";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import TradeParam from "@/components/TradeFields/TradeParam";
import { DurationController } from "./DurationController";
import { Popover } from "@/components/ui/popover";
import { DesktopTradeFieldCard } from "@/components/ui/desktop-trade-field-card";
import { MobileTradeFieldCard } from "@/components/ui/mobile-trade-field-card";
import { useOrientationStore } from "@/stores/orientationStore";

interface DurationFieldProps {
    className?: string;
}

export const DurationField: React.FC<DurationFieldProps> = ({ className }) => {
    const { duration, isConfigLoading, productConfig } = useTradeStore();
    const { setBottomSheet } = useBottomSheetStore();
    const { isLandscape } = useOrientationStore();
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<{ isClosing: boolean }>({ isClosing: false });

    const handleClick = () => {
        if (!productConfig) return; // Disable click when no config

        if (isLandscape) {
            if (!popoverRef.current.isClosing) {
                setIsOpen(!isOpen);
            }
        } else {
            setBottomSheet(true, "duration", "470px");
        }
    };

    const handleClose = () => {
        popoverRef.current.isClosing = true;
        setIsOpen(false);
        // Reset after a longer delay
        setTimeout(() => {
            popoverRef.current.isClosing = false;
        }, 300); // 300ms should be enough for the animation to complete
    };

    if (isConfigLoading) {
        return (
            <div className={`${className} relative`}>
                <div
                    data-testid="duration-field-skeleton"
                    className="h-[66px] bg-theme-secondary rounded relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-theme-hover before:to-transparent"
                />
            </div>
        );
    }

    const tradeParam = (
        <TradeParam
            label="Duration"
            value={productConfig ? duration : "N/A"}
            onClick={handleClick}
            className={`${className} ${!productConfig ? "opacity-50 cursor-not-allowed" : ""}`}
        />
    );

    return (
        <div className="relative">
            {isLandscape ? (
                <DesktopTradeFieldCard isSelected={isOpen}>{tradeParam}</DesktopTradeFieldCard>
            ) : (
                <MobileTradeFieldCard onClick={handleClick}>{tradeParam}</MobileTradeFieldCard>
            )}
            {isLandscape && isOpen && (
                <Popover
                    isOpen={isOpen}
                    onClose={handleClose}
                    style={{
                        position: "absolute",
                        right: "100%",
                        top: "-8px",
                        marginRight: "16px",
                    }}
                >
                    <DurationController onClose={handleClose} />
                </Popover>
            )}
        </div>
    );
};
