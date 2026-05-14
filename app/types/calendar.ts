
type WeeklyEventWithDuration = {
  endHour?: never;
  endMinute?: never;
  duration: number;  // in hours
}

type WeeklyEventWithEndHour = {
  endHour: number;   // 0-23
  endMinute?: number; // 0-59
  duration?: never;
}

type WeeklyEventBase = {
  id: string;
  title: string;
  startHour: number; // 0-23
  startMinute?: number; // 0-59
  day: number;       // 0 (Sun) to 6 (Sat)
  color?: string;
}

export type WeeklyEvent = WeeklyEventBase & (WeeklyEventWithDuration | WeeklyEventWithEndHour);
