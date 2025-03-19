// Format timestamps to "01 Jan 2024" format
export const formatDate = (timestamp: number) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

// Format timestamps to "16:20:02 GMT" format
export const formatTime = (timestamp: number) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toTimeString().substring(0, 8) + " GMT";
};
