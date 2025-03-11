import React, { useState, useRef } from "react";
import { useTradeStore } from "@/stores/tradeStore";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import TradeParam from "@/components/TradeFields/TradeParam";
import { DurationController } from "./DurationController";
import { Popover } from "@/components/ui/popover";
import { DesktopTradeFieldCard } from "@/components/ui/desktop-trade-field-card";
import { useOrientationStore } from "@/stores/orientationStore";

interface DurationFieldProps {
    className?: string;
}

export const DurationField: React.FC<DurationFieldProps> = ({ className }) => {
    const { duration, isConfigLoading } = useTradeStore();
    const { setBottomSheet } = useBottomSheetStore();
    const { isLandscape } = useOrientationStore();
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<{ isClosing: boolean }>({ isClosing: false });

    const handleClick = () => {
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
                    className="h-[66px] bg-gray-200 rounded relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent"
                />
            </div>
        );
    }

    return (
        <div className="relative">
            {isLandscape ? (
                <DesktopTradeFieldCard isSelected={isOpen}>
                    <TradeParam
                        label="Duration"
                        value={duration}
                        onClick={handleClick}
                        className={className}
                    />
                </DesktopTradeFieldCard>
            ) : (
                <TradeParam
                    label="Duration"
                    value={duration}
                    onClick={handleClick}
                    className={className}
                />
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
