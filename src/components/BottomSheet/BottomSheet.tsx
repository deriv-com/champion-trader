import { useRef, useCallback, useEffect } from "react";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { bottomSheetConfig } from "@/config/bottomSheetConfig";

export const BottomSheet = () => {
  const { showBottomSheet, key, height, onDragDown, setBottomSheet } = useBottomSheetStore();
  
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    dragStartY.current = touch.clientY;
    currentY.current = 0;
    isDragging.current = true;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!sheetRef.current || !isDragging.current) return;

    const touch = e.touches[0];
    const deltaY = touch.clientY - dragStartY.current;
    currentY.current = deltaY;

    if (deltaY > 0) {
      sheetRef.current.style.transform = `translateY(${deltaY}px)`;
      onDragDown?.();
    }
  }, [onDragDown]);

  const handleTouchEnd = useCallback(() => {
    if (!sheetRef.current) return;

    isDragging.current = false;
    sheetRef.current.style.transform = "";

    if (currentY.current > 100) {
      setBottomSheet(false);
    }
  }, [setBottomSheet]);

  useEffect(() => {
    if (showBottomSheet) {
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [showBottomSheet, handleTouchMove, handleTouchEnd]);

  const body = key ? bottomSheetConfig[key]?.body : null;

  if (!showBottomSheet || !body) return null;

  // Convert percentage to vh for height if needed
  const processedHeight = height.endsWith('%') 
    ? `${parseFloat(height)}vh` 
    : height;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/80 z-50 animate-in fade-in-0"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        style={{ height: processedHeight }}
        className={`
          fixed bottom-0 left-0 right-0
          flex flex-col
          max-w-[800px]
          w-full
          mx-auto
          bg-background
          rounded-t-[16px]
          animate-in fade-in-0 slide-in-from-bottom
          duration-300
          z-50
          transition-transform
          overflow-hidden
        `}
      >
        {/* Handle Bar */}
        <div 
          className="flex flex-col items-center justify-center px-0 py-2 w-full"
          onTouchStart={handleTouchStart}
        >
          <div 
            className="w-32 h-1 bg-muted hover:bg-muted-foreground transition-colors cursor-grab active:cursor-grabbing" 
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {body}
        </div>
      </div>
    </>
  );
};
