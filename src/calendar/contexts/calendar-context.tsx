"use client";

import { createContext, useContext, useMemo, useCallback, useState } from "react";

import { useCalendarEvents } from "@/calendar/hooks/use-calendar-events";
import { useCalendarStore } from "@/lib/stores/calendar-store";

import type { IEvent, IUser } from "@/calendar/interfaces";
import type { TBadgeVariant, TVisibleHours, TWorkingHours } from "@/calendar/types";

interface ICalendarContext {
  selectedDate: Date;
  setSelectedDate: (date: Date | undefined) => void;
  selectedUserId: IUser["id"];
  badgeVariant: TBadgeVariant;
  setBadgeVariant: (variant: TBadgeVariant) => void;
  users: IUser[];
  workingHours: TWorkingHours;
  setWorkingHours: (hours: TWorkingHours) => void;
  visibleHours: TVisibleHours;
  setVisibleHours: (hours: TVisibleHours) => void;
  events: IEvent[];
  isLoading: boolean;
  error: string | null;
  addEvent: (event: Omit<IEvent, "id" | "user">) => Promise<void>;
  updateEvent: (event: IEvent) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
}

const CalendarContext = createContext<ICalendarContext | null>(null);

const WORKING_HOURS: TWorkingHours = {
  0: { from: 0, to: 0 },
  1: { from: 8, to: 17 },
  2: { from: 8, to: 17 },
  3: { from: 8, to: 17 },
  4: { from: 8, to: 17 },
  5: { from: 8, to: 17 },
  6: { from: 8, to: 12 },
};

const VISIBLE_HOURS: TVisibleHours = { from: 7, to: 18 };

interface ICalendarProviderProps {
  children: React.ReactNode;
  users: IUser[];
  currentUser: IUser;
}

export function CalendarProvider({ children, users, currentUser }: ICalendarProviderProps) {
  const { selectedDate, badgeVariant, setSelectedDate, setBadgeVariant } = useCalendarStore();
  const [workingHours, setWorkingHours] = useState<TWorkingHours>(WORKING_HOURS);
  const [visibleHours, setVisibleHours] = useState<TVisibleHours>(VISIBLE_HOURS);

  const { events, isLoading, error, addEvent, updateEvent, deleteEvent } =
    useCalendarEvents(currentUser);

  const handleSelectDate = useCallback((date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
  }, [setSelectedDate]);

  const value = useMemo(
    () => ({
      selectedDate,
      setSelectedDate: handleSelectDate,
      selectedUserId: currentUser.id,
      badgeVariant,
      setBadgeVariant,
      users,
      workingHours,
      setWorkingHours,
      visibleHours,
      setVisibleHours,
      events,
      isLoading,
      error,
      addEvent,
      updateEvent,
      deleteEvent,
    }),
    [
      selectedDate,
      handleSelectDate,
      currentUser.id,
      badgeVariant,
      setBadgeVariant,
      users,
      workingHours,
      setWorkingHours,
      visibleHours,
      setVisibleHours,
      events,
      isLoading,
      error,
      addEvent,
      updateEvent,
      deleteEvent,
    ]
  );

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar(): ICalendarContext {
  const context = useContext(CalendarContext);
  if (!context) throw new Error("useCalendar must be used within a CalendarProvider.");
  return context;
}
