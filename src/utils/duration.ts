export function convertHourToMinutes(hourValue: string): number {
  const [hours, minutes] = hourValue.split(":").map(Number);
  return (hours * 60) + (minutes || 0);
}

export const formatDurationDisplay = (duration: string): string => {
  const [value, type] = duration.split(" ");
  
  if (type === "hour") {
    const [hours, minutes] = value.split(":").map(Number);
    const hourText = hours === 1 ? "hour" : "hours";
    const minuteText = minutes === 1 ? "minute" : "minutes";
    return minutes > 0 ? `${hours} ${hourText} ${minutes} ${minuteText}` : `${hours} ${hourText}`;
  }

  const numValue = parseInt(value, 10);
  switch (type) {
    case "tick":
      return `${numValue} ${numValue === 1 ? "tick" : "ticks"}`;
    case "second":
      return `${numValue} ${numValue === 1 ? "second" : "seconds"}`;
    case "minute":
      return `${numValue} ${numValue === 1 ? "minute" : "minutes"}`;
    case "day":
      return `${numValue} day`;
    default:
      return duration;
  }
};
