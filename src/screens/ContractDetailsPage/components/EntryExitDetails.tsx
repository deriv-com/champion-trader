import React from "react";
import { Contract } from "@/api/services/contract/types";
import { formatTime, formatDate } from "@/utils/date-format";

interface EntryExitDetailsProps {
    contract: Contract;
}

export const EntryExitDetails: React.FC<EntryExitDetailsProps> = ({ contract }) => {
    const { details } = contract;

    const entryExitDetails = [
        {
            label: "Start time",
            value: formatDate(details.contract_start_time),
            subValue: formatTime(details.contract_start_time),
        },
        {
            label: "Entry spot",
            value: details.entry_spot || "N/A",
            subValue:
                formatDate(details.entry_tick_time) + "\n" + formatTime(details.entry_tick_time),
        },
        {
            label: "Exit time",
            value: formatDate(details.exit_time || 0),
            subValue: formatTime(details.exit_time || 0),
        },
        {
            label: "Exit spot",
            value: details.exit_spot || "N/A",
            subValue:
                formatDate(details.exit_tick_time || 0) +
                "\n" +
                formatTime(details.exit_tick_time || 0),
        },
    ];

    return (
        <div
            className="mt-4 p-4 bg-theme rounded-lg border-b border-theme"
            style={{
                boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)",
            }}
        >
            <h2 className="text-[14px] leading-[22px] font-ibm-plex font-bold text-theme mb-4">
                Entry & exit details
            </h2>
            {entryExitDetails.map((detail, index) => (
                <div
                    key={index}
                    className="col-span-2 flex justify-between border-b border-theme py-2"
                >
                    <span className="text-theme-muted font-ibm-plex text-[14px] leading-[22px] font-normal">
                        {detail.label}
                    </span>
                    <div className="text-right">
                        <span className="text-theme font-ibm-plex text-[14px] leading-[22px] font-normal block pb-1">
                            {detail.value}
                        </span>
                        {detail.subValue && (
                            <div className="text-theme-muted font-ibm-plex text-[12px] leading-[18px] font-normal">
                                {detail.subValue.split("\n").map((text, i) => (
                                    <div key={i}>{text}</div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
