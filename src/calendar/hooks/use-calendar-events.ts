"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { queryKeys } from "@/lib/query/query-keys";
import type { IEvent, IEventRow, IUser } from "@/calendar/interfaces";
import type { TEventColor } from "@/calendar/types";

// ─── Mappers ──────────────────────────────────────────────────────────────────

function rowToEvent(row: IEventRow, user: IUser): IEvent {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    color: row.color,
    startDate: row.start_date,
    endDate: row.end_date,
    user,
  };
}

function eventToRow(
  event: Pick<IEvent, "title" | "description" | "color" | "startDate" | "endDate">,
  userId: string
): Omit<IEventRow, "id" | "created_at" | "updated_at" | "reminder_sent_at"> {
  return {
    user_id: userId,
    title: event.title,
    description: event.description,
    color: event.color as TEventColor,
    start_date: event.startDate,
    end_date: event.endDate,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCalendarEvents(currentUser: IUser) {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const qk = queryKeys.events(currentUser.id);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: qk,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("start_date", { ascending: true });
      if (error) throw error;
      return (data as IEventRow[]).map(row => rowToEvent(row, currentUser));
    },
    enabled: !!currentUser.id,
  });

  // ── Add ────────────────────────────────────────────────────────────────────
  const addMutation = useMutation({
    mutationFn: async (event: Omit<IEvent, "id" | "user">) => {
      const { data, error } = await supabase
        .from("events")
        .insert(eventToRow(event, currentUser.id))
        .select()
        .single();
      if (error) throw error;
      return rowToEvent(data as IEventRow, currentUser);
    },
    onMutate: async (event) => {
      await queryClient.cancelQueries({ queryKey: qk });
      const previous = queryClient.getQueryData<IEvent[]>(qk);
      const optimistic: IEvent = { ...event, id: -Date.now(), user: currentUser };
      queryClient.setQueryData<IEvent[]>(qk, old => [...(old ?? []), optimistic]);
      return { previous, tempId: optimistic.id };
    },
    onError: (_err, _event, context) => {
      queryClient.setQueryData(qk, context?.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: qk }),
  });

  // ── Update ─────────────────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: async (updated: IEvent) => {
      const { error } = await supabase
        .from("events")
        .update({
          title: updated.title,
          description: updated.description,
          color: updated.color,
          start_date: new Date(updated.startDate).toISOString(),
          end_date: new Date(updated.endDate).toISOString(),
        })
        .eq("id", updated.id)
        .eq("user_id", currentUser.id);
      if (error) throw error;
    },
    onMutate: async (updated) => {
      await queryClient.cancelQueries({ queryKey: qk });
      const previous = queryClient.getQueryData<IEvent[]>(qk);
      queryClient.setQueryData<IEvent[]>(qk, old =>
        (old ?? []).map(e => (e.id === updated.id ? updated : e))
      );
      return { previous };
    },
    onError: (_err, _event, context) => {
      queryClient.setQueryData(qk, context?.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: qk }),
  });

  // ── Delete ─────────────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id)
        .eq("user_id", currentUser.id);
      if (error) throw error;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: qk });
      const previous = queryClient.getQueryData<IEvent[]>(qk);
      queryClient.setQueryData<IEvent[]>(qk, old => (old ?? []).filter(e => e.id !== id));
      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(qk, context?.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: qk }),
  });

  return {
    events,
    isLoading,
    error: error ? (error as Error).message : null,
    addEvent: addMutation.mutateAsync,
    updateEvent: updateMutation.mutateAsync,
    deleteEvent: deleteMutation.mutateAsync,
  };
}
