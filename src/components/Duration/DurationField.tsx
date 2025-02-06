import React, { useState, useRef } from "react";
import { useTradeStore } from "@/stores/tradeStore";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import TradeParam from "@/components/TradeFields/TradeParam";
import { DurationController } from "./DurationController";

interface DurationFieldProps {
  className?: string;
}

export const DurationField: React.FC<DurationFieldProps> = ({ className }) => {
  const { duration } = useTradeStore();
  const { setBottomSheet } = useBottomSheetStore();
  const { isDesktop } = useDeviceDetection();
  const [showPopover, setShowPopover] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (isDesktop) {
      setShowPopover(true);
    } else {
      setBottomSheet(true, "duration", "470px");
    }
  };

  const handleClose = () => {
    setShowPopover(false);
  };

  // Close popover when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        fieldRef.current &&
        !fieldRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    };

    if (showPopover) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopover]);

  return (
    <div ref={fieldRef} className="relative">
      <TradeParam
        label="Duration"
        value={duration}
        onClick={handleClick}
        className={className}
      />

      {isDesktop && showPopover && (
        <>
          {/* Popover */}
          <div 
            className="absolute z-50"
            style={{
              right: '100%',
              top: 0,
              marginRight: '8px'
            }}
          >
            <DurationController onClose={handleClose} />
          </div>
        </>
      )}
    </div>
  );
};
