import React, { useState, useRef } from "react";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import TradeParam from "./TradeParam";

interface TradeParamFieldProps {
  label: string;
  value: string;
  type: "duration" | "stake" | "barrier";
  children?: React.ReactNode;
  onSelect?: (value: string) => void;
  className?: string;
}

export const TradeParamField: React.FC<TradeParamFieldProps> = ({
  label,
  value,
  type,
  children,
  onSelect,
  className,
}) => {
  const { isDesktop } = useDeviceDetection();
  const { setBottomSheet } = useBottomSheetStore();
  const [showPopover, setShowPopover] = useState(false);
  const paramRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (isDesktop) {
      setShowPopover(true);
    } else {
      setBottomSheet(true, type);
    }
  };

  const handleClose = () => {
    setShowPopover(false);
  };

  // Close popover when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        paramRef.current &&
        !paramRef.current.contains(event.target as Node)
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
    <div ref={paramRef} className="relative">
      <TradeParam
        label={label}
        value={value}
        onClick={handleClick}
        className={className}
      />

      {isDesktop && showPopover && (
        <>
          {/* Popover */}
          <div
            className="absolute z-50 mt-2 bg-white rounded-lg shadow-lg"
            style={{
              width: "480px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {React.Children.map(children, (child) =>
              React.isValidElement(child)
                ? React.cloneElement(child as React.ReactElement, {
                    onClose: handleClose,
                  })
                : child
            )}
          </div>
        </>
      )}
    </div>
  );
};
