// @ts-nocheck
import React from "react";
import { getUrlBase, moduleLoader } from "@/lib/chart-utils";
import "./chart-styles.css";

let smartchartsModule;

const init = () => {
    smartchartsModule = moduleLoader(() => {
        return import(/* webpackChunkName: "smart_chart" */ "@deriv/deriv-charts");
    });

    smartchartsModule
        .then(({ setSmartChartsPublicPath }) => {
            try {
                setSmartChartsPublicPath(getUrlBase("/js/smartcharts/"));
                console.log("SmartCharts path set successfully");
            } catch (error) {
                console.error("Error setting SmartCharts path:", error);
            }
        })
        .catch((error) => {
            console.error("Failed to load SmartCharts module:", error);
        });
};

// Initialize the module immediately
init();

// React.Lazy expects a default export for the component
// SmartChart library exports many components
const load = (component_name) => () => {
    if (!smartchartsModule) {
        init();
    }
    return smartchartsModule.then((module) => {
        return { default: module[component_name] };
    });
};

export const SmartChart = React.lazy(load("SmartChart"));
export const ChartTitle = React.lazy(load("ChartTitle"));

export const ChartSize = React.lazy(load("ChartSize"));
export const ChartMode = React.lazy(load("ChartMode"));
export const DrawTools = React.lazy(load("DrawTools"));
export const Share = React.lazy(load("Share"));
export const StudyLegend = React.lazy(load("StudyLegend"));
export const Views = React.lazy(load("Views"));
export const ToolbarWidget = React.lazy(load("ToolbarWidget"));

export const FastMarker = React.lazy(load("FastMarker"));
export const RawMarker = React.lazy(load("RawMarker"));
