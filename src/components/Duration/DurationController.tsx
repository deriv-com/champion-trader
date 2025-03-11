import React, { useEffect, useRef, useMemo } from "react";
import { TabList, Tab } from "@/components/ui/tab-list";
import { BottomSheetHeader } from "@/components/ui/bottom-sheet-header";
import { DurationValueList } from "./components/DurationValueList";
import { HoursDurationValue } from "./components/HoursDurationValue";
import { useTradeStore } from "@/stores/tradeStore";
import { PrimaryButton } from "@/components/ui/primary-button";
import { generateDurationValues as getDurationValues, getDefaultDuration } from "@/utils/duration";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";
import { useDebounce } from "@/hooks/useDebounce";
import { DesktopTradeFieldCard } from "@/components/ui/desktop-trade-field-card";
import type { DurationRangesResponse } from "@/services/api/rest/duration/types";
import { useOrientationStore } from "@/stores/orientationStore";
import { getAvailableDurationTypes } from "@/adapters/duration-config-adapter";

const DURATION_TYPES: Tab[] = [
    { label: "Ticks", value: "ticks" },
    { label: "Seconds", value: "seconds" },
    { label: "Minutes", value: "minutes" },
    { label: "Hours", value: "hours" },
    { label: "Days", value: "days" },
] as const;

type DurationType = keyof DurationRangesResponse;

interface DurationControllerProps {
    onClose?: () => void;
}

export const DurationController: React.FC<DurationControllerProps> = ({ onClose }) => {
    const { productConfig: config, duration, setDuration } = useTradeStore();
    const { isLandscape } = useOrientationStore();
    const { setBottomSheet } = useBottomSheetStore();
    const isInitialRender = useRef(true);

    useEffect(() => {
        isInitialRender.current = true;
        return () => {
            isInitialRender.current = false;
        };
    }, []);

    // Get available duration types using utility function
    const availableDurationTypes = useMemo(
        () => getAvailableDurationTypes(config, DURATION_TYPES),
        [config]
    );

    // Initialize local states
    const [localDuration, setLocalDuration] = React.useState(duration);
    const [value, type] = localDuration.split(" ");

    // Track selected tab type separately from duration value
    const [selectedTabType, setSelectedTabType] = React.useState<DurationType>(
        type as DurationType
    );

    // Track selected values for each tab type - only initialize with current value
    const [selectedValues, setSelectedValues] = React.useState<
        Partial<Record<DurationType, string | number>>
    >({
        [type as DurationType]: type === "hours" ? value : parseInt(value, 10),
    });

    // Get the selected value for the current tab
    const selectedValue = selectedValues[selectedTabType];

    // Use debounced updates for desktop scroll
    useDebounce(
        localDuration,
        (value) => {
            if (isLandscape) {
                setDuration(value);
            }
        },
        300
    );

    const handleTypeSelect = (type: DurationType) => {
        setSelectedTabType(type);
    };

    const handleValueSelect = (value: number | string) => {
        setSelectedValues((prev) => ({
            ...prev,
            [selectedTabType]: value,
        }));
        const newDuration = `${value} ${selectedTabType}`;
        setLocalDuration(newDuration);
    };

    const handleValueClick = (value: number | string) => {
        setSelectedValues((prev) => ({
            ...prev,
            [selectedTabType]: value,
        }));
        const newDuration = `${value} ${selectedTabType}`;
        setLocalDuration(newDuration);
        setDuration(newDuration); // Update store immediately on click
        if (isLandscape) {
            onClose?.();
        }
    };

    const handleSave = () => {
        setDuration(localDuration);
        if (isLandscape) {
            onClose?.();
        } else {
            setBottomSheet(false);
        }
    };

    const content = (
        <>
            <div className={isLandscape ? "flex" : ""}>
                {!isLandscape && <BottomSheetHeader title="Duration" />}
                <div className="mx-4 w-fit">
                    <TabList
                        tabs={availableDurationTypes}
                        selectedValue={selectedTabType}
                        onSelect={handleTypeSelect as (value: string) => void}
                        variant={isLandscape ? "vertical" : "chip"}
                    />
                </div>
                <div className={`flex-1 relative bg-white ${isLandscape ? "px-2" : "px-8"}`}>
                    {selectedTabType === "hours" ? (
                        <HoursDurationValue
                            selectedValue={selectedValue?.toString() || ""}
                            onValueSelect={(value) => {
                                handleValueSelect(value);
                            }}
                            onValueClick={handleValueClick}
                            isInitialRender={isInitialRender}
                        />
                    ) : (
                        <DurationValueList
                            key={selectedTabType}
                            selectedValue={
                                (selectedValue as number) ?? getDefaultDuration(selectedTabType)
                            }
                            durationType={selectedTabType}
                            onValueSelect={handleValueSelect}
                            onValueClick={handleValueClick}
                            getDurationValues={getDurationValues}
                        />
                    )}
                </div>
            </div>
            {!isLandscape && (
                <div className="w-full p-3">
                    <PrimaryButton className="rounded-3xl" onClick={handleSave}>
                        Save
                    </PrimaryButton>
                </div>
            )}
        </>
    );

    if (isLandscape) {
        return (
            <DesktopTradeFieldCard className="p-0">
                <div className="w-[368px]">{content}</div>
            </DesktopTradeFieldCard>
        );
    }

    return <div className="flex flex-col h-full">{content}</div>;
};
