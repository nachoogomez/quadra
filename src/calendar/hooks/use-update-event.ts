import { useCalendar } from "@/calendar/contexts/calendar-context";
import type { IEvent } from "@/calendar/interfaces";

export function useUpdateEvent() {
  const { updateEvent } = useCalendar();

  return { updateEvent: (event: IEvent) => updateEvent(event) };
}
