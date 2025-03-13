import React, { useEffect, useRef } from "react";

export interface ScrollSelectOption<T> {
    value: T;
    label: string;
}

export interface ScrollSelectProps<T> {
    options: ScrollSelectOption<T>[];
    selectedValue: T;
    onValueSelect: (value: T) => void;
    onValueClick?: (value: T) => void;
    itemHeight?: number;
    containerHeight?: number;
    renderOption?: (option: ScrollSelectOption<T>, isSelected: boolean) => React.ReactNode;
}

const ITEM_HEIGHT = 48;
const CONTAINER_HEIGHT = 268;
const SPACER_HEIGHT = 110;

export const ScrollSelect = <T extends React.Key>({
    options,
    selectedValue,
    onValueSelect,
    onValueClick,
    itemHeight = ITEM_HEIGHT,
    containerHeight = CONTAINER_HEIGHT,
    renderOption,
}: ScrollSelectProps<T>) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const intersectionObserverRef = useRef<IntersectionObserver>();

    const handleClick = (value: T) => {
        if (onValueClick) {
            onValueClick(value);
        } else {
            onValueSelect(value);
        }

        const clickedItem = containerRef.current?.querySelector(`[data-value="${value}"]`);
        if (clickedItem) {
            clickedItem.scrollIntoView({
                block: "center",
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Store current values in refs to avoid stale closures
        const optionsRef = options;
        const onValueSelectRef = onValueSelect;

        // First scroll to selected value
        const selectedItem = container.querySelector(`[data-value="${selectedValue}"]`);
        if (selectedItem) {
            selectedItem.scrollIntoView({ block: "center", behavior: "instant" });
        }

        let observerTimeout: NodeJS.Timeout;

        // Add a small delay before setting up the observer to ensure scroll completes
        observerTimeout = setTimeout(() => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const value = entry.target.getAttribute("data-value");
                            if (value !== null) {
                                // Find the option with matching value
                                const option = optionsRef.find(
                                    (opt) => String(opt.value) === value
                                );
                                if (option) {
                                    onValueSelectRef(option.value);
                                }
                            }
                        }
                    });
                },
                {
                    root: container,
                    rootMargin: "-51% 0px -49% 0px",
                    threshold: 0,
                }
            );

            const items = container.querySelectorAll(".scroll-select-item");
            items.forEach((item) => observer.observe(item));

            // Store the observer reference
            intersectionObserverRef.current = observer;
        }, 100);

        // Proper cleanup function
        return () => {
            clearTimeout(observerTimeout);
            if (intersectionObserverRef.current) {
                intersectionObserverRef.current.disconnect();
            }
        };
    }, []); // Empty dependency array since we handle updates via refs

    return (
        <div
            className="relative"
            style={
                {
                    "--itemHeight": `${itemHeight}px`,
                    "--containerHeight": `${containerHeight}px`,
                    "--topBit": "calc((var(--containerHeight) - var(--itemHeight))/2)",
                    height: containerHeight,
                } as React.CSSProperties
            }
        >
            {/* Selection zone with gradient background */}
            <div
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                    height: itemHeight,
                    background: "linear-gradient(rgb(229 231 235 / 0.5), rgb(229 231 235 / 0.5))",
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
                    msOverflowStyle: "none",
                }}
            >
                {/* Top spacer */}
                <div style={{ height: `${SPACER_HEIGHT}px` }} />

                {options.map((option) => (
                    <label
                        key={option.value}
                        style={{ height: `${itemHeight}px` }}
                        className="scroll-select-item flex items-center justify-center snap-center cursor-pointer"
                        data-value={option.value}
                        onClick={() => handleClick(option.value)}
                    >
                        <input
                            type="radio"
                            name="scroll-select"
                            value={String(option.value)}
                            checked={selectedValue === option.value}
                            onChange={() => onValueSelect(option.value)}
                            className="hidden"
                        />
                        {renderOption ? (
                            renderOption(option, selectedValue === option.value)
                        ) : (
                            <span
                                className={`
                  text-base font-normal leading-6 text-center transition-colors
                  ${selectedValue === option.value ? "text-theme" : "text-theme-muted"}
                `}
                            >
                                {option.label}
                            </span>
                        )}
                    </label>
                ))}

                {/* Bottom spacer */}
                <div style={{ height: `${SPACER_HEIGHT}px` }} />
            </div>
        </div>
    );
};
