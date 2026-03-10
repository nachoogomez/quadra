"use client";

import { create } from "zustand";
import type { TBadgeVariant } from "@/calendar/types";

interface CalendarStore {
  selectedDate: Date;
  badgeVariant: TBadgeVariant;
  setSelectedDate: (date: Date) => void;
  setBadgeVariant: (variant: TBadgeVariant) => void;
}

export const useCalendarStore = create<CalendarStore>(set => ({
  selectedDate: new Date(),
  badgeVariant: "colored",
  setSelectedDate: (date) => set({ selectedDate: date }),
  setBadgeVariant: (badgeVariant) => set({ badgeVariant }),
}));
