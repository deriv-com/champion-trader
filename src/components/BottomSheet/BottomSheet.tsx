import { useRef, useCallback, useEffect } from "react";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { bottomSheetConfig } from "@/config/bottomSheetConfig";
import { PrimaryButton } from "../ui/primary-button";
import { useOrientationStore } from "@/stores/orientationStore";

export const BottomSheet = () => {
    const { showBottomSheet, key, height, onDragDown, actionButton, setBottomSheet } =
        useBottomSheetStore();
    const { isLandscape } = useOrientationStore();

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

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault(); // Prevent default selection
        document.body.style.userSelect = "none"; // Disable text selection
        dragStartY.current = e.clientY;
        currentY.current = 0;
        isDragging.current = true;
    }, []);

    const handleTouchMove = useCallback(
        (e: TouchEvent) => {
            if (!sheetRef.current || !isDragging.current) return;

            const touch = e.touches[0];
            const deltaY = touch.clientY - dragStartY.current;
            currentY.current = deltaY;

            if (deltaY > 0) {
                e.preventDefault(); // Prevent browser refresh
                sheetRef.current.style.transform = `translateY(${deltaY}px)`;
                onDragDown?.();
            }
        },
        [onDragDown]
    );

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!sheetRef.current || !isDragging.current) return;

            requestAnimationFrame(() => {
                const deltaY = e.clientY - dragStartY.current;
                currentY.current = deltaY;

                if (deltaY > 0) {
                    e.preventDefault();
                    sheetRef.current!.style.transform = `translateY(${deltaY}px)`;
                    onDragDown?.();
                }
            });
        },
        [onDragDown]
    );

    const handleDragEnd = useCallback(() => {
        if (!sheetRef.current) return;

        if (isDragging.current) {
            isDragging.current = false;
            document.body.style.userSelect = ""; // Re-enable text selection
            sheetRef.current.style.transform = "";

            if (currentY.current > 100) {
                setBottomSheet(false);
            }
        }
    }, [setBottomSheet]);

    useEffect(() => {
        if (showBottomSheet) {
            const handleMouseLeave = () => {
                if (isDragging.current) {
                    handleDragEnd();
                }
            };

            // Touch events
            document.addEventListener("touchmove", handleTouchMove, {
                passive: false,
            });
            document.addEventListener("touchend", handleDragEnd);
            // Mouse events
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleDragEnd);
            window.addEventListener("mouseleave", handleMouseLeave);

            return () => {
                // Clean up touch events
                document.removeEventListener("touchmove", handleTouchMove);
                document.removeEventListener("touchend", handleDragEnd);
                // Clean up mouse events
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleDragEnd);
                window.removeEventListener("mouseleave", handleMouseLeave);
                // Clean up styles when sheet is closed
                document.body.style.userSelect = "";
            };
        }
    }, [showBottomSheet, handleTouchMove, handleMouseMove, handleDragEnd]);

    const body = key ? bottomSheetConfig[key]?.body : null;

    if (!showBottomSheet || !body) return null;

    // Convert percentage to vh for height if needed
    const processedHeight = height.endsWith("%") ? `${parseFloat(height)}vh` : height;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/80 z-[60] animate-in fade-in-0"
                onClick={() => {
                    // Only close if clicking the overlay itself, not its children
                    onDragDown?.();
                    setBottomSheet(false);
                }}
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
          bg-theme
          rounded-t-[16px]
          animate-in fade-in-0 slide-in-from-bottom
          duration-300
          z-[60]
          transition-transform
          overflow-hidden
        `}
            >
                {/* Handle Bar */}
                <div
                    className="flex flex-col items-center justify-center px-0 py-2 w-full"
                    onTouchStart={handleTouchStart}
                    onMouseDown={handleMouseDown}
                    onClick={() => {
                        if (isLandscape) {
                            onDragDown?.();
                            setBottomSheet(false);
                        }
                    }}
                >
                    <div className="w-32 h-1 bg-muted hover:bg-muted-foreground transition-colors cursor-grab active:cursor-grabbing" />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">{body}</div>
                {actionButton?.show && (
                    <div className="sticky bottom-0 w-full p-4">
                        <PrimaryButton
                            className="w-full rounded-3xl"
                            onClick={actionButton.onClick}
                        >
                            {actionButton.label}
                        </PrimaryButton>
                    </div>
                )}
            </div>
        </>
    );
};
