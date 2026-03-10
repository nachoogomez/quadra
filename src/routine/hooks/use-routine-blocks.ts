"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { queryKeys } from "@/lib/query/query-keys";
import type { IRoutineBlock, IRoutineBlockRow, TRoutineColor } from "@/routine/types";

// ─── Mappers ──────────────────────────────────────────────────────────────────

function rowToBlock(row: IRoutineBlockRow): IRoutineBlock {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    color: row.color,
    dayOfWeek: row.day_of_week,
    startHour: row.start_hour,
    startMinute: row.start_minute,
    endHour: row.end_hour,
    endMinute: row.end_minute,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRoutineBlocks(userId: string) {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const qk = queryKeys.routineBlocks(userId);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const { data: blocks = [], isLoading, error } = useQuery({
    queryKey: qk,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("routine_blocks")
        .select("*")
        .eq("user_id", userId)
        .order("day_of_week", { ascending: true });
      if (error) throw error;
      return (data as IRoutineBlockRow[]).map(rowToBlock);
    },
    enabled: !!userId,
  });

  // ── Add ────────────────────────────────────────────────────────────────────
  const addMutation = useMutation({
    mutationFn: async (block: Omit<IRoutineBlock, "id">) => {
      const { data, error } = await supabase
        .from("routine_blocks")
        .insert({
          user_id: userId,
          title: block.title,
          description: block.description,
          location: block.location,
          color: block.color as TRoutineColor,
          day_of_week: block.dayOfWeek,
          start_hour: block.startHour,
          start_minute: block.startMinute,
          end_hour: block.endHour,
          end_minute: block.endMinute,
        })
        .select()
        .single();
      if (error) throw error;
      return rowToBlock(data as IRoutineBlockRow);
    },
    onMutate: async (block) => {
      await queryClient.cancelQueries({ queryKey: qk });
      const previous = queryClient.getQueryData<IRoutineBlock[]>(qk);
      const optimistic: IRoutineBlock = { ...block, id: `temp-${Date.now()}` };
      queryClient.setQueryData<IRoutineBlock[]>(qk, old => [...(old ?? []), optimistic]);
      return { previous, tempId: optimistic.id };
    },
    onSuccess: (created, _block, context) => {
      queryClient.setQueryData<IRoutineBlock[]>(qk, old =>
        (old ?? []).map(b => (b.id === context?.tempId ? created : b))
      );
    },
    onError: (_err, _block, context) => {
      queryClient.setQueryData(qk, context?.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: qk }),
  });

  // ── Update ─────────────────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: async (updated: IRoutineBlock) => {
      const { error } = await supabase
        .from("routine_blocks")
        .update({
          title: updated.title,
          description: updated.description,
          location: updated.location,
          color: updated.color,
          day_of_week: updated.dayOfWeek,
          start_hour: updated.startHour,
          start_minute: updated.startMinute,
          end_hour: updated.endHour,
          end_minute: updated.endMinute,
        })
        .eq("id", updated.id)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onMutate: async (updated) => {
      await queryClient.cancelQueries({ queryKey: qk });
      const previous = queryClient.getQueryData<IRoutineBlock[]>(qk);
      queryClient.setQueryData<IRoutineBlock[]>(qk, old =>
        (old ?? []).map(b => (b.id === updated.id ? updated : b))
      );
      return { previous };
    },
    onError: (_err, _block, context) => {
      queryClient.setQueryData(qk, context?.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: qk }),
  });

  // ── Delete ─────────────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("routine_blocks")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: qk });
      const previous = queryClient.getQueryData<IRoutineBlock[]>(qk);
      queryClient.setQueryData<IRoutineBlock[]>(qk, old => (old ?? []).filter(b => b.id !== id));
      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(qk, context?.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: qk }),
  });

  return {
    blocks,
    isLoading,
    error: error ? (error as Error).message : null,
    addBlock: addMutation.mutateAsync,
    updateBlock: updateMutation.mutateAsync,
    deleteBlock: deleteMutation.mutateAsync,
  };
}
