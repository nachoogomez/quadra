"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { isSameDay, parseISO } from "date-fns";

import { useCalendar } from "@/calendar/contexts/calendar-context";

import { DndProviderWrapper } from "@/calendar/components/dnd/dnd-provider";
import { CalendarHeader } from "@/calendar/components/header/calendar-header";

import type { TCalendarView } from "@/calendar/types";

const CalendarDayView = dynamic(() =>
  import("@/calendar/components/week-and-day-view/calendar-day-view").then(m => ({ default: m.CalendarDayView }))
);
const CalendarWeekView = dynamic(() =>
  import("@/calendar/components/week-and-day-view/calendar-week-view").then(m => ({ default: m.CalendarWeekView }))
);
const CalendarMonthView = dynamic(() =>
  import("@/calendar/components/month-view/calendar-month-view").then(m => ({ default: m.CalendarMonthView }))
);
const CalendarYearView = dynamic(() =>
  import("@/calendar/components/year-view/calendar-year-view").then(m => ({ default: m.CalendarYearView }))
);
const CalendarAgendaView = dynamic(() =>
  import("@/calendar/components/agenda-view/calendar-agenda-view").then(m => ({ default: m.CalendarAgendaView }))
);

interface IProps {
  view: TCalendarView;
}

export function ClientContainer({ view }: IProps) {
  const { selectedDate, selectedUserId, events } = useCalendar();

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const eventStartDate = parseISO(event.startDate);
      const eventEndDate = parseISO(event.endDate);

      if (view === "year") {
        const yearStart = new Date(selectedDate.getFullYear(), 0, 1);
        const yearEnd = new Date(selectedDate.getFullYear(), 11, 31, 23, 59, 59, 999);
        const isInSelectedYear = eventStartDate <= yearEnd && eventEndDate >= yearStart;
        const isUserMatch = event.user.id === selectedUserId;
        return isInSelectedYear && isUserMatch;
      }

      if (view === "month" || view === "agenda") {
        const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999);
        const isInSelectedMonth = eventStartDate <= monthEnd && eventEndDate >= monthStart;
        const isUserMatch = event.user.id === selectedUserId;
        return isInSelectedMonth && isUserMatch;
      }

      if (view === "week") {
        const dayOfWeek = selectedDate.getDay();

        const weekStart = new Date(selectedDate);
        weekStart.setDate(selectedDate.getDate() - dayOfWeek);
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        const isInSelectedWeek = eventStartDate <= weekEnd && eventEndDate >= weekStart;
        const isUserMatch = event.user.id === selectedUserId;
        return isInSelectedWeek && isUserMatch;
      }

      if (view === "day") {
        const dayStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0);
        const dayEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59);
        const isInSelectedDay = eventStartDate <= dayEnd && eventEndDate >= dayStart;
        const isUserMatch = event.user.id === selectedUserId;
        return isInSelectedDay && isUserMatch;
      }
    });
  }, [selectedDate, selectedUserId, events, view]);

  const { singleDayEvents, multiDayEvents } = useMemo(() => {
    const single = [];
    const multi = [];
    for (const event of filteredEvents) {
      const startDate = parseISO(event.startDate);
      const endDate = parseISO(event.endDate);
      if (isSameDay(startDate, endDate)) {
        single.push(event);
      } else {
        multi.push(event);
      }
    }
    return { singleDayEvents: single, multiDayEvents: multi };
  }, [filteredEvents]);

  // For year view, we only care about the start date
  // by using the same date for both start and end,
  // we ensure only the start day will show a dot
  const eventStartDates = useMemo(() => {
    return filteredEvents.map(event => ({ ...event, endDate: event.startDate }));
  }, [filteredEvents]);

  return (
    <div className="overflow-hidden rounded-xl border">
      <CalendarHeader view={view} events={filteredEvents} />

      <DndProviderWrapper>
        {view === "day" && <CalendarDayView singleDayEvents={singleDayEvents} multiDayEvents={multiDayEvents} />}
        {view === "month" && <CalendarMonthView singleDayEvents={singleDayEvents} multiDayEvents={multiDayEvents} />}
        {view === "week" && <CalendarWeekView singleDayEvents={singleDayEvents} multiDayEvents={multiDayEvents} />}
        {view === "year" && <CalendarYearView allEvents={eventStartDates} />}
        {view === "agenda" && <CalendarAgendaView singleDayEvents={singleDayEvents} multiDayEvents={multiDayEvents} />}
      </DndProviderWrapper>
    </div>
  );
}
