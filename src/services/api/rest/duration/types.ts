export interface DurationRange {
    min: number;
    max: number;
    step?: number;
}

export interface DurationRangesResponse {
    ticks: DurationRange;
    seconds: DurationRange;
    minutes: DurationRange;
    hours: DurationRange;
    days: DurationRange;
}
