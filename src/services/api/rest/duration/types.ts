export interface DurationRange {
  min: number;
  max: number;
  step?: number;
}

export interface DurationRangesResponse {
  tick: DurationRange;
  second: DurationRange;
  minute: DurationRange;
  hour: DurationRange;
  day: DurationRange;
}
