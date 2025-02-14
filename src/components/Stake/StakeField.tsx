import React, { useState, useRef } from "react";
import { useTradeStore } from "@/stores/tradeStore";
import { useClientStore } from "@/stores/clientStore";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import TradeParam from "@/components/TradeFields/TradeParam";
import { StakeController } from "./StakeController";
import { Popover } from "@/components/ui/popover";

interface StakeFieldProps {
  className?: string;
}

export const StakeField: React.FC<StakeFieldProps> = ({ className }) => {
  const { stake } = useTradeStore();
  const { currency } = useClientStore();
  const { setBottomSheet } = useBottomSheetStore();
  const { isDesktop } = useDeviceDetection();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<{ isClosing: boolean }>({ isClosing: false });

  const handleClick = () => {
    if (isDesktop) {
      if (!popoverRef.current.isClosing) {
        setIsOpen(!isOpen);
      }
    } else {
      setBottomSheet(true, "stake", "400px");
    }
  };

  const { setStake } = useTradeStore();

  const handleClose = () => {
    setStake(stake); // Ensure the latest stake value is saved
    popoverRef.current.isClosing = true;
    setIsOpen(false);
    // Reset after a longer delay
    setTimeout(() => {
      popoverRef.current.isClosing = false;
    }, 300); // 300ms should be enough for the animation to complete
  };

  return (
    <div className="relative">
      <TradeParam
        label="Stake"
        value={`${stake} ${currency}`}
        onClick={handleClick}
        className={className}
      />

      {isDesktop && isOpen && (
        <Popover
          isOpen={isOpen}
          onClose={handleClose}
          style={{
            position: 'absolute',
            right: '100%',
            top: '-8px',
            marginRight: '16px'
          }}
        >
          <StakeController />
        </Popover>
      )}
    </div>
  );
};
