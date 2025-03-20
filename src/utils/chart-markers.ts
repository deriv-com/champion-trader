import {
    createMarkerEndTime,
    createMarkerPurchaseTime,
    createMarkerSpotEntry,
    createMarkerSpotExit,
    createMarkerStartTime,
    createMarkerResetTime,
    getSpotCount,
    isAccumulatorContract,
    isTicksContract,
    getEndTime,
} from "./chart-marker-helpers";
import { MARKER_TYPES_CONFIG } from "@/config/markers";

/**
 * Creates chart markers for a contract
 * @param contract_info - The contract information
 * @param is_delayed_markers_update - Whether the markers update is delayed
 * @returns An array of chart markers
 */
export const createChartMarkers = (contract_info: any, is_delayed_markers_update?: boolean) => {
    const { tick_stream } = contract_info || {};
    const should_show_10_last_ticks =
        isAccumulatorContract(contract_info?.contract_type) && tick_stream?.length === 10;

    let markers = [];
    if (contract_info) {
        const end_time = getEndTime(contract_info);
        const chart_type = getChartType(contract_info.date_start, end_time);

        if (contract_info.tick_count) {
            const tick_markers = createTickMarkers(contract_info, is_delayed_markers_update);
            markers.push(...tick_markers);
        } else if (chart_type !== "candles") {
            const spot_entry = createMarkerSpotEntry(contract_info);
            const spot_exit = createMarkerSpotExit(contract_info);

            const spot_markers = [spot_entry, spot_exit].filter(Boolean);
            markers.push(...spot_markers);
        }

        if (!should_show_10_last_ticks) {
            // don't draw start/end lines if only 10 last ticks are displayed
            const start_time = createMarkerStartTime(contract_info);
            const reset_time = createMarkerResetTime(contract_info);
            const end_time_marker = createMarkerEndTime(contract_info);
            const purchase_time = createMarkerPurchaseTime(contract_info);

            const line_markers = [start_time, reset_time, end_time_marker, purchase_time].filter(
                Boolean
            );
            markers.push(...line_markers);
        }

        markers = markers.filter((m) => !!m);
    }

    markers.forEach((marker) => {
        const contract_id = contract_info?.contract_id || "default";
        marker.react_key = `${contract_id}-${marker.type}`;
    });
    return markers;
};

/**
 * Gets the chart type based on start and end times
 * @param start_time - The start time
 * @param end_time - The end time
 * @returns The chart type
 */
export const getChartType = (start_time?: number, end_time?: number) => {
    if (!start_time || !end_time) return "line";

    const duration = end_time - start_time;
    // If duration is more than 3 days, use candles
    if (duration > 3 * 24 * 60 * 60) return "candles";

    return "line";
};

/**
 * Adds label alignment to a tick
 * @param tick - The tick to add alignment to
 * @param idx - The index of the tick
 * @param arr - The array of ticks
 * @returns The tick with alignment
 */
const addLabelAlignment = (tick: any, idx: number, arr: any[]) => {
    if (idx > 0 && arr.length) {
        const prev_tick = arr[idx - 1];

        if (+tick.tick > +prev_tick.tick) tick.align_label = "top";
        if (+tick.tick < +prev_tick.tick) tick.align_label = "bottom";
        if (+tick.tick === +prev_tick.tick) tick.align_label = prev_tick.align_label;
    }

    return tick;
};

/**
 * Creates tick markers for a contract
 * @param contract_info - The contract information
 * @param is_delayed_markers_update - Whether the markers update is delayed
 * @returns An array of tick markers
 */
export const createTickMarkers = (contract_info: any, is_delayed_markers_update?: boolean) => {
    const is_accumulator = isAccumulatorContract(contract_info?.contract_type);
    const is_ticks_contract = isTicksContract(contract_info?.contract_type);
    const is_accu_contract_closed = is_accumulator && contract_info?.status !== "open";
    const available_ticks =
        (is_accumulator && contract_info?.audit_details?.all_ticks) || contract_info?.tick_stream;

    if (!available_ticks || !available_ticks.length) return [];

    // Create a unique array of ticks based on epoch
    const unique = (arr: any[], key: string) => {
        const seen = new Set();
        return arr.filter((item) => {
            const k = item[key];
            return seen.has(k) ? false : seen.add(k);
        });
    };

    const tick_stream = unique(available_ticks, "epoch").map(addLabelAlignment);
    const result: any[] = [];

    if (is_accu_contract_closed) {
        const { exit_tick_time, tick_stream: ticks } = contract_info || {};
        if (
            exit_tick_time &&
            tick_stream.every(({ epoch }: { epoch: number }) => epoch !== exit_tick_time)
        ) {
            // sometimes exit_tick is present in tick_stream but missing from audit_details
            tick_stream.push(ticks[ticks.length - 1]);
        }
        const exit_tick_count =
            tick_stream.findIndex(({ epoch }: { epoch: number }) => epoch === exit_tick_time) + 1;
        tick_stream.length = exit_tick_count > 0 ? exit_tick_count : tick_stream.length;
    }

    tick_stream.forEach((tick: any, idx: number) => {
        const isEntrySpot = (_tick: any) => +_tick.epoch === contract_info.entry_tick_time;
        const is_entry_spot =
            +tick.epoch !== contract_info.exit_tick_time &&
            (is_accumulator ? isEntrySpot(tick) : idx === 0);
        // accumulators entry spot will be missing from tick_stream when contract is lasting for longer than 10 ticks
        const entry_spot_index = is_accumulator ? tick_stream.findIndex(isEntrySpot) : 0;
        const is_middle_spot =
            idx > entry_spot_index && +tick.epoch !== +contract_info.exit_tick_time;
        const is_selected_tick = is_ticks_contract && idx + 1 === contract_info.selected_tick;
        const isExitSpot = (_tick: any, _idx: number) =>
            +_tick.epoch === +contract_info.exit_tick_time ||
            getSpotCount(contract_info, _idx) === contract_info.tick_count;
        const is_exit_spot = isExitSpot(tick, idx);
        const is_current_last_spot = idx === tick_stream.length - 1;
        const exit_spot_index = tick_stream.findIndex(isExitSpot);
        const is_accu_current_last_spot = is_accumulator && !is_exit_spot && is_current_last_spot;
        const is_accu_preexit_spot =
            is_accumulator &&
            (is_accu_contract_closed
                ? idx === exit_spot_index - 1
                : idx === tick_stream.length - 2);

        let marker_config: any = null;
        if (is_entry_spot) {
            marker_config = createMarkerSpotEntry(contract_info);
        } else if (is_middle_spot) {
            marker_config = createMarkerSpotMiddle(contract_info, tick, idx);
        } else if (is_exit_spot && !is_accu_current_last_spot) {
            tick.align_label = "top"; // force exit spot label to be 'top' to avoid overlapping
            marker_config = createMarkerSpotExit(contract_info, tick, idx);
        }

        if (is_selected_tick && isSmartTraderContract(contract_info.contract_type)) {
            marker_config = createMarkerSpotMiddle(contract_info, tick, idx);
        }

        if (marker_config && marker_config.content_config) {
            const spot_className = marker_config.content_config.spot_className;

            if (
                isSmartTraderContract(contract_info.contract_type) &&
                is_middle_spot &&
                !is_selected_tick
            ) {
                marker_config.content_config.spot_className = `${spot_className} ${spot_className}--smarttrader-contract-middle`;

                if (!is_current_last_spot) {
                    marker_config.content_config.is_value_hidden = true;
                }
            }

            if (is_selected_tick) {
                marker_config.content_config.spot_className = `${spot_className} chart-spot__spot--${contract_info.status}`;
            }

            if (is_accumulator) {
                if ((is_accu_current_last_spot || is_exit_spot) && !is_accu_contract_closed) return;
                if (is_middle_spot || is_exit_spot) {
                    const should_highlight_previous_spot =
                        is_accu_preexit_spot &&
                        (!is_delayed_markers_update || is_accu_contract_closed);
                    marker_config.content_config.spot_className = `${spot_className} ${spot_className}--accumulator${
                        is_exit_spot
                            ? "-exit"
                            : `-middle${should_highlight_previous_spot ? "--preexit" : ""}`
                    }`;
                }
            }
        }

        if (marker_config) {
            // Add ContentComponent to marker_config if it's missing
            if (marker_config.marker_config && !marker_config.marker_config.ContentComponent) {
                marker_config.marker_config.ContentComponent = "div";
            }

            result.push(marker_config);
        }
    });

    return result;
};

/**
 * Creates a marker for a spot in the middle of a contract
 * @param contract_info - The contract information
 * @param tick - The tick information
 * @param idx - The index of the tick
 * @returns The marker configuration
 */
export const createMarkerSpotMiddle = (contract_info: any, tick: any, idx: number) => {
    const is_accumulator = isAccumulatorContract(contract_info.contract_type);
    const is_ticks_contract = isTicksContract(contract_info.contract_type);
    const spot_count = getSpotCount(contract_info, idx);
    const spot = tick.tick_display_value || tick.tick || tick.quote;
    const spot_epoch = is_accumulator ? "" : `${tick.epoch}`;

    const marker_config = {
        ...MARKER_TYPES_CONFIG.SPOT_MIDDLE,
        marker_config: {
            ...MARKER_TYPES_CONFIG.SPOT_MIDDLE.marker_config,
            x: +tick.epoch,
            y: +spot,
        },
        content_config: {
            ...MARKER_TYPES_CONFIG.SPOT_MIDDLE.content_config,
            spot_value: `${spot}`,
            spot_epoch,
            align_label: tick.align_label,
            is_value_hidden:
                is_accumulator || (is_ticks_contract && idx + 1 !== contract_info.selected_tick),
            spot_count,
            status: `${is_ticks_contract ? contract_info.status : ""}`,
        },
    };

    marker_config.type = `${marker_config.type}_${idx}`;

    if (isMobile() && spot_count && spot_count > 1 && !is_ticks_contract) return null;
    return marker_config;
};

/**
 * Checks if a contract is a smart trader contract
 * @param contract_type - The contract type
 * @returns Whether the contract is a smart trader contract
 */
export const isSmartTraderContract = (contract_type: string) => {
    return /smart_trader/i.test(contract_type);
};

/**
 * Checks if the device is mobile
 * @returns Whether the device is mobile
 */
export const isMobile = () => {
    return window.innerWidth <= 768;
};
