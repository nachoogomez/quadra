"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { queryKeys } from "@/lib/query/query-keys";
import type { ITask, TColumn, TLabel } from "@/tasks/types";

// ─── DB row shape ─────────────────────────────────────────────────────────────

interface TaskRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  labels: TLabel[];
  due_date: string | null;
  status: TColumn;
  completed: boolean;
  position: number;
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function rowToTask(row: TaskRow): ITask {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    labels: row.labels ?? [],
    dueDate: row.due_date ?? undefined,
    column: row.status,
    completed: row.completed,
  };
}

function taskToRow(task: ITask, userId: string, position: number): TaskRow {
  return {
    id: task.id,
    user_id: userId,
    title: task.title,
    description: task.description ?? null,
    labels: task.labels,
    due_date: task.dueDate ?? null,
    status: task.column,
    completed: task.completed ?? false,
    position,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTasks(userId: string) {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const qk = queryKeys.tasks(userId);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: qk,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("position", { ascending: true });
      if (error) throw error;
      return (data as TaskRow[]).map(rowToTask);
    },
    enabled: !!userId,
  });

  // ── Add ────────────────────────────────────────────────────────────────────
  const addMutation = useMutation({
    mutationFn: async (task: ITask) => {
      const current = queryClient.getQueryData<ITask[]>(qk) ?? [];
      const position = current.filter(t => t.column === task.column).length;
      const { error } = await supabase
        .from("tasks")
        .insert(taskToRow(task, userId, position));
      if (error) throw error;
    },
    onMutate: async (task) => {
      await queryClient.cancelQueries({ queryKey: qk });
      const previous = queryClient.getQueryData<ITask[]>(qk);
      queryClient.setQueryData<ITask[]>(qk, old => [...(old ?? []), task]);
      return { previous };
    },
    onError: (_err, _task, context) => {
      queryClient.setQueryData(qk, context?.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: qk }),
  });

  // ── Save (edit) ────────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: async (updated: ITask) => {
      const { error } = await supabase
        .from("tasks")
        .update({
          title: updated.title,
          description: updated.description ?? null,
          labels: updated.labels,
          due_date: updated.dueDate ?? null,
          status: updated.column,
          completed: updated.completed ?? false,
        })
        .eq("id", updated.id)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onMutate: async (updated) => {
      await queryClient.cancelQueries({ queryKey: qk });
      const previous = queryClient.getQueryData<ITask[]>(qk);
      queryClient.setQueryData<ITask[]>(qk, old =>
        (old ?? []).map(t => (t.id === updated.id ? updated : t))
      );
      return { previous };
    },
    onError: (_err, _task, context) => {
      queryClient.setQueryData(qk, context?.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: qk }),
  });

  // ── Delete ─────────────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: qk });
      const previous = queryClient.getQueryData<ITask[]>(qk);
      queryClient.setQueryData<ITask[]>(qk, old => (old ?? []).filter(t => t.id !== id));
      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(qk, context?.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: qk }),
  });

  // ── Toggle complete ────────────────────────────────────────────────────────
  const toggleMutation = useMutation({
    mutationFn: async ({ id, nowComplete, newColumn }: { id: string; nowComplete: boolean; newColumn: TColumn }) => {
      const { error } = await supabase
        .from("tasks")
        .update({ completed: nowComplete, status: newColumn })
        .eq("id", id)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onMutate: async ({ id, nowComplete, newColumn }) => {
      await queryClient.cancelQueries({ queryKey: qk });
      const previous = queryClient.getQueryData<ITask[]>(qk);
      queryClient.setQueryData<ITask[]>(qk, old =>
        (old ?? []).map(t =>
          t.id === id ? { ...t, completed: nowComplete, column: newColumn } : t
        )
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(qk, context?.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: qk }),
  });

  const toggleComplete = (id: string) => {
    const current = queryClient.getQueryData<ITask[]>(qk) ?? tasks;
    const task = current.find(t => t.id === id);
    if (!task) return;
    const nowComplete = !task.completed;
    toggleMutation.mutate({ id, nowComplete, newColumn: nowComplete ? "completed" : "todo" });
  };

  // ── Move column (local only — no DB call, persisted on drag end) ───────────
  const moveTaskColumn = (id: string, toColumn: TColumn) => {
    queryClient.setQueryData<ITask[]>(qk, old =>
      (old ?? []).map(t =>
        t.id === id ? { ...t, column: toColumn, completed: toColumn === "completed" } : t
      )
    );
  };

  // ── Reorder within column ──────────────────────────────────────────────────
  const reorderMutation = useMutation({
    mutationFn: async (reordered: ITask[]) => {
      const { error } = await supabase.from("tasks").upsert(
        reordered.map((t, i) => ({
          id: t.id,
          user_id: userId,
          position: i,
          status: t.column,
          completed: t.completed ?? false,
        }))
      );
      if (error) throw error;
    },
    onMutate: async (reordered) => {
      await queryClient.cancelQueries({ queryKey: qk });
      const previous = queryClient.getQueryData<ITask[]>(qk);
      const col = reordered[0]?.column;
      queryClient.setQueryData<ITask[]>(qk, old => [
        ...(old ?? []).filter(t => t.column !== col),
        ...reordered,
      ]);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(qk, context?.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: qk }),
  });

  return {
    tasks,
    isLoading,
    error: error ? (error as Error).message : null,
    addTask: addMutation.mutate,
    saveTask: saveMutation.mutate,
    deleteTask: deleteMutation.mutate,
    toggleComplete,
    moveTaskColumn,
    reorderTasks: reorderMutation.mutate,
  };
}
