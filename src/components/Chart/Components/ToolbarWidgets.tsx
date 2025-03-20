import React, { useEffect } from "react";
import { ChartMode, DrawTools, Share, StudyLegend, Views, ToolbarWidget } from "../SmartChart";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";

type TToolbarWidgetsProps = {
    position?: string;
    updateChartType: (type: string) => void;
    updateGranularity: (granularity: number) => void;
};

const ToolbarWidgets = ({ position, updateChartType, updateGranularity }: TToolbarWidgetsProps) => {
    const { isMobile } = useDeviceDetection();

    // Add a class to the body when on mobile to help with CSS targeting
    useEffect(() => {
        if (isMobile) {
            document.body.classList.add("chart-mobile-view");
        } else {
            document.body.classList.remove("chart-mobile-view");
        }

        return () => {
            document.body.classList.remove("chart-mobile-view");
        };
    }, [isMobile]);

    return (
        <ToolbarWidget
            position={position || (isMobile ? "bottom" : null)}
            className={isMobile ? "mobile-toolbar-widget" : ""}
        >
            {
                <ChartMode
                    portalNodeId="modal_root"
                    onChartType={updateChartType}
                    onGranularity={updateGranularity}
                    className={isMobile ? "mobile-chart-mode" : ""}
                />
            }
            {!isMobile && (
                <StudyLegend portalNodeId="modal_root" searchInputClassName="data-hj-whitelist" />
            )}
            {!isMobile && (
                <Views
                    portalNodeId="modal_root"
                    searchInputClassName="data-hj-whitelist"
                    onChartType={updateChartType}
                    onGranularity={updateGranularity}
                />
            )}
            {!isMobile && <DrawTools portalNodeId="modal_root" />}
            {!isMobile && <Share portalNodeId="modal_root" />}
        </ToolbarWidget>
    );
};

export default React.memo(ToolbarWidgets);
