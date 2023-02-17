export type TimeInterval = TimeType | IntervalType;

export interface TimeType {
  type: 'time';
  value: string;
}

export interface IntervalType {
  type: 'interval';
  value: number;
}
