import SpotMarker from "@/components/ContractDetailsChart/SpotMarker";
import MarkerLine from "@/components/ContractDetailsChart/MarkerLine";

// Default marker configuration
const default_marker_config = {
    ContentComponent: MarkerLine,
    className: "chart-marker-line",
};

export const MARKER_TYPES_CONFIG = {
    LINE_END: {
        type: "LINE_END",
        marker_config: {
            ...default_marker_config,
        },
        content_config: { line_style: "dash", label: "End Time" },
    },
    LINE_PURCHASE: {
        type: "LINE_PURCHASE",
        marker_config: {
            ...default_marker_config,
        },
        content_config: { line_style: "solid", label: "Purchase Time" },
    },
    LINE_START: {
        type: "LINE_START",
        marker_config: {
            ...default_marker_config,
        },
        content_config: { line_style: "solid", label: "Start Time" },
    },
    LINE_RESET: {
        type: "LINE_RESET",
        marker_config: {
            ...default_marker_config,
        },
        content_config: { line_style: "dash", label: "Reset Time" },
    },
    SPOT_ENTRY: {
        type: "SPOT_ENTRY",
        marker_config: {
            ContentComponent: SpotMarker,
        },
        content_config: { className: "chart-spot__entry", spot_className: "chart-spot__spot" },
    },
    SPOT_SELL: {
        type: "SPOT_SELL",
        marker_config: {
            ContentComponent: SpotMarker,
        },
        content_config: { className: "chart-spot__sell", spot_className: "chart-spot__spot" },
    },
    SPOT_EXIT: {
        type: "SPOT_EXIT",
        marker_config: {
            ContentComponent: SpotMarker,
        },
        content_config: { className: "chart-spot__exit", spot_className: "chart-spot__spot" },
    },
    SPOT_EXIT_2: {
        type: "SPOT_EXIT_2",
        marker_config: {
            ContentComponent: SpotMarker,
        },
        content_config: { className: "chart-spot__exit", spot_className: "chart-spot__spot" },
    },
    SPOT_MIDDLE: {
        type: "SPOT_MIDDLE",
        marker_config: {
            ContentComponent: SpotMarker,
        },
        content_config: { className: "chart-spot__middle", spot_className: "chart-spot__spot" },
    },
};
