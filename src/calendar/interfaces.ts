import type { TEventColor } from "@/calendar/types";

export interface IUser {
  id: string;
  name: string;
  picturePath: string | null;
}

export interface IEvent {
  id: number;
  startDate: string;
  endDate: string;
  title: string;
  color: TEventColor;
  description: string;
  user: IUser;
}

export interface ICalendarCell {
  day: number;
  currentMonth: boolean;
  date: Date;
}

// ─── DB row shape (matches Supabase schema) ────────────────────────────────
export interface IEventRow {
  id: number;
  user_id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  color: TEventColor;
  created_at: string;
  updated_at: string;
  reminder_sent_at: string | null;
}
