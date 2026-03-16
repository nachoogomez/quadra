"use client";

import { useCalendar } from "@/calendar/contexts/calendar-context";

export function useUpdateEvent() {
  const { updateEvent } = useCalendar();
  return { updateEvent };
}
