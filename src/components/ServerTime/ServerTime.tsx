import React, { useEffect } from "react";
import { useServerTimeStore } from "@/stores/serverTimeStore";

export const ServerTime: React.FC = () => {
    const { serverTime, setServerTime } = useServerTimeStore();

    useEffect(() => {
        const updateTime = () => {
            setServerTime(new Date());
        };

        // Update immediately and then every second
        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, [setServerTime]);

    return (
        <div className="text-xs text-theme-muted flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#008832]"></div>
                {serverTime.getDate().toString().padStart(2, "0")}{" "}
                {serverTime.toLocaleString("default", { month: "short" })}{" "}
                {serverTime.getFullYear()}
            </div>
            <div>{serverTime.toTimeString().split(" ")[0]} GMT</div>
        </div>
    );
};
