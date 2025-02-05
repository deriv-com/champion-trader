import { useRef, useCallback, useEffect } from "react";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { useTradeStore } from "@/stores/tradeStore";
import { bottomSheetConfig } from "@/config/bottomSheetConfig";
export const BottomSheet = () => {
  const { showBottomSheet, key, height, onDragDown, setBottomSheet } =
    useBottomSheetStore();

  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  const handleStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    dragStartY.current = touch.clientY;
    currentY.current = 0;
    isDragging.current = true;
  }, []);

  const handleMove = useCallback(
    (e: TouchEvent) => {
      if (!sheetRef.current || !isDragging.current) return;

      const touch = e.touches[0];
      const deltaY = touch.clientY - dragStartY.current;
      currentY.current = deltaY;

      if (deltaY > 0) {
        sheetRef.current.style.transform = `translateY(${deltaY}px)`;
        onDragDown?.();
      }
    },
    [onDragDown]
  );

  const { setStake, setDuration, numpadValue } = useTradeStore();

  const handleEnd = useCallback(() => {
    if (!sheetRef.current) return;
    if (key === "stake") setStake(numpadValue);
    if (key === "duration") setDuration(numpadValue);
    isDragging.current = false;
    sheetRef.current.style.transition = "transform 0.3s ease-out";
    if (currentY.current > 100) {
      sheetRef.current.style.transform = "translateY(100%)";
      setTimeout(() => setBottomSheet(false), 300);
    } else {
      sheetRef.current.style.transform = "translateY(0)";
    }

  }, [setBottomSheet, numpadValue]);

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientY);
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientY);
    const handleMouseUp = () => handleEnd();

    if (showBottomSheet) {
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleEnd);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleEnd);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [showBottomSheet, handleMove, handleEnd]);

  const body = key ? bottomSheetConfig[key]?.body : null;

  if (!showBottomSheet || !body) return null;

  // Convert percentage to vh for height if needed
  const processedHeight = height.endsWith("%")
    ? `${parseFloat(height)}vh`
    : height;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/80 z-50 animate-in fade-in-0"
        onClick={() => {
          // Only close if clicking the overlay itself, not its children
          onDragDown?.();
          setBottomSheet(false);
        }}
      />

      <div
        ref={sheetRef}
        id="bottom-sheet"
        className="fixed bottom-0 left-0 right-0 flex flex-col max-w-[800px] w-full mx-auto bg-background rounded-t-[16px] animate-in fade-in-0 slide-in-from-bottom duration-300 z-50 transition-transform overflow-hidden"
      >
        {/* Handle Bar */}
        <div
          className="flex flex-col items-center justify-center px-0 py-2 w-full"
          onTouchStart={(e) => handleStart(e.touches[0].clientY)}
          onMouseDown={(e) => handleStart(e.clientY)}
        >
          <div className="w-32 h-1 bg-muted hover:bg-muted-foreground transition-colors cursor-grab active:cursor-grabbing" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">{body}</div>
      </div>
    </>
  );
};
