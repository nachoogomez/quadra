export type TRoutineColor = "blue" | "green" | "red" | "yellow" | "purple" | "orange" | "gray";

export type TWeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Mon, 6 = Sun

export interface IRoutineBlock {
  id: string;
  title: string;
  description: string;
  location: string;
  color: TRoutineColor;
  dayOfWeek: TWeekDay; // 0=Mon, 1=Tue, ..., 6=Sun
  startHour: number; // 0-23
  startMinute: number; // 0 or 30
  endHour: number;
  endMinute: number; // 0 or 30
}

// DB row shape (snake_case)
export interface IRoutineBlockRow {
  id: string;
  user_id: string;
  title: string;
  description: string;
  location: string;
  color: TRoutineColor;
  day_of_week: number;
  start_hour: number;
  start_minute: number;
  end_hour: number;
  end_minute: number;
  created_at: string;
  updated_at: string;
}
