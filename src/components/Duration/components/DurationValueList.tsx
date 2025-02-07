import React, { useEffect, useRef } from "react";

interface DurationValueListProps {
  selectedValue: number;
  durationType: string;
  onValueSelect: (value: number) => void;
  getDurationValues: (type: string) => number[];
}

const getUnitLabel = (type: string, value: number): string => {
  switch (type) {
    case "tick":
      return value === 1 ? "tick" : "ticks";
    case "second":
      return value === 1 ? "second" : "seconds";
    case "minute":
      return value === 1 ? "minute" : "minutes";
    case "hour":
      return value === 1 ? "hour" : "hours";
    case "day":
      return "day";
    default:
      return "";
  }
};

const ITEM_HEIGHT = 48;
const SPACER_HEIGHT = 110;

export const DurationValueList: React.FC<DurationValueListProps> = ({
  selectedValue,
  durationType,
  onValueSelect,
  getDurationValues
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const values = getDurationValues(durationType);
  const intersectionObserverRef = useRef<IntersectionObserver>();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleClick = (value: number) => {
    // First call onValueSelect to update the selected value
    onValueSelect(value);
    
    // Then scroll the clicked item into view with smooth animation
    const clickedItem = containerRef.current?.querySelector(`[data-value="${value}"]`);
    if (clickedItem) {
      clickedItem.scrollIntoView({ 
        block: 'center',
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // First scroll to selected value
    const selectedItem = container.querySelector(`[data-value="${selectedValue}"]`);
    if (selectedItem) {
      selectedItem.scrollIntoView({ block: 'center', behavior: 'instant' });
    }

    // Add a small delay before setting up the observer to ensure scroll completes
    timeoutRef.current = setTimeout(() => {
      intersectionObserverRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const value = parseInt(
                entry.target.getAttribute("data-value") || "0",
                10
              );
              onValueSelect(value);
            }
          });
        },
        {
          root: container,
          rootMargin: "-51% 0px -49% 0px",
          threshold: 0,
        }
      );

      const items = container.querySelectorAll(".duration-value-item");
      items.forEach((item) => intersectionObserverRef.current?.observe(item));

      return () => {
        if (intersectionObserverRef.current) {
          intersectionObserverRef.current.disconnect();
        }
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, 100);
  }, []);

  return (
    <div
      className="relative h-[268px]"
      style={
        {
          "--itemHeight": `${ITEM_HEIGHT}px`,
          "--containerHeight": "268px",
          "--topBit": "calc((var(--containerHeight) - var(--itemHeight))/2)",
        } as React.CSSProperties
      }
    >
      {/* Selection zone with gradient background */}
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[48px] bg-gray-100/50 pointer-events-none"
        style={{
          background:
            "linear-gradient(rgb(229 231 235 / 0.5), rgb(229 231 235 / 0.5))",
        }}
      />

      {/* Scrollable content */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto scroll-smooth snap-y snap-mandatory [&::-webkit-scrollbar]:hidden"
        style={{
          scrollSnapType: "y mandatory",
          overscrollBehavior: "none",
          scrollbarWidth: "none",
          msOverflowStyle: "none"
        }}
      >
        {/* Top spacer */}
        <div style={{ height: `${SPACER_HEIGHT}px` }} />

        {values.map((value) => (
          <label
            key={value}
            style={{ height: `${ITEM_HEIGHT}px` }}
            className="duration-value-item flex items-center justify-center snap-center cursor-pointer"
            data-value={value}
            onClick={() => handleClick(value)}
          >
            <input
              type="radio"
              name="duration-value"
              value={value}
              checked={selectedValue === value}
              onChange={() => onValueSelect(value)}
              className="hidden"
            />
            <span
              className={`
                text-base font-normal leading-6 text-center transition-colors
                ${selectedValue === value ? "text-black" : "text-gray-300"}
              `}
            >
              {value} {getUnitLabel(durationType, value)}
            </span>
          </label>
        ))}

        {/* Bottom spacer */}
        <div style={{ height: `${SPACER_HEIGHT}px` }} />
      </div>
    </div>
  );
};
