import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollableTabsProps {
    tabs: { id: string; label: string }[];
    activeTab: string;
    onTabChange: (id: string) => void;
    className?: string;
}

export const ScrollableTabs: React.FC<ScrollableTabsProps> = ({
    tabs,
    activeTab,
    onTabChange,
    className,
}) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1); // -1 for rounding errors
        }
    };

    useEffect(() => {
        checkScrollButtons();
        window.addEventListener("resize", checkScrollButtons);
        return () => window.removeEventListener("resize", checkScrollButtons);
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === "left" ? -200 : 200;
            scrollContainerRef.current.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const handleScroll = () => {
        checkScrollButtons();
    };

    return (
        <div className={cn("relative group", className)}>
            {showLeftArrow && (
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 px-2 bg-theme-bg/95"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-5 h-5 text-theme-muted" />
                </button>
            )}

            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="overflow-x-auto scrollbar-none scroll-smooth"
                style={{
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                    WebkitOverflowScrolling: "touch",
                }}
            >
                <div className="flex min-w-max px-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={cn(
                                "px-4 py-3 font-ibm text-base font-normal leading-6 whitespace-nowrap transition-colors relative",
                                activeTab === tab.id
                                    ? "text-theme after:absolute after:left-0 after:right-0 after:bottom-0 after:h-0.5 after:bg-primary"
                                    : "text-theme-muted hover:text-theme"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {showRightArrow && (
                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 px-2 bg-theme-bg/95"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-5 h-5 text-theme-muted" />
                </button>
            )}
        </div>
    );
};
