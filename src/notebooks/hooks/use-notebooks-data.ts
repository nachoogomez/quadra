"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { queryKeys } from "@/lib/query/query-keys";
import type { INotebook, INote, INotebookRow, INoteRow, TNoteColor } from "@/notebooks/types";

// ─── Mappers ──────────────────────────────────────────────────────────────────

function rowToNotebook(row: INotebookRow): INotebook {
  return {
    id: row.id,
    title: row.title,
    icon: row.icon,
    color: row.color,
    createdAt: row.created_at,
    editedAt: row.edited_at,
  };
}

function rowToNote(row: INoteRow): INote {
  return {
    id: row.id,
    notebookId: row.notebook_id,
    title: row.title,
    content: JSON.stringify(row.content),
    color: row.color,
    createdAt: row.created_at,
    editedAt: row.edited_at,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useNotebooksData(userId: string) {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const nbQk = queryKeys.notebooks(userId);
  const noteQk = queryKeys.notes(userId);

  // ── Fetch notebooks ────────────────────────────────────────────────────────
  const { data: notebooks = [], isLoading: nbLoading } = useQuery({
    queryKey: nbQk,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notebooks")
        .select("*")
        .eq("user_id", userId)
        .order("edited_at", { ascending: false });
      if (error) throw error;
      return (data as INotebookRow[]).map(rowToNotebook);
    },
    enabled: !!userId,
  });

  // ── Fetch notes ────────────────────────────────────────────────────────────
  const { data: notes = [], isLoading: noteLoading } = useQuery({
    queryKey: noteQk,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", userId)
        .order("edited_at", { ascending: false });
      if (error) throw error;
      return (data as INoteRow[]).map(rowToNote);
    },
    enabled: !!userId,
  });

  const isLoading = nbLoading || noteLoading;

  // ── Create notebook ────────────────────────────────────────────────────────
  const createNotebookMutation = useMutation({
    mutationFn: async (nb: Omit<INotebook, "id" | "createdAt" | "editedAt">) => {
      const { data, error } = await supabase
        .from("notebooks")
        .insert({ user_id: userId, title: nb.title, icon: nb.icon, color: nb.color as TNoteColor })
        .select()
        .single();
      if (error) throw error;
      return rowToNotebook(data as INotebookRow);
    },
    onSuccess: (created) => {
      queryClient.setQueryData<INotebook[]>(nbQk, old => [created, ...(old ?? [])]);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: nbQk }),
  });

  // ── Create note ────────────────────────────────────────────────────────────
  const createNoteMutation = useMutation({
    mutationFn: async (note: Omit<INote, "id" | "createdAt" | "editedAt">) => {
      const { data, error } = await supabase
        .from("notes")
        .insert({
          user_id: userId,
          notebook_id: note.notebookId,
          title: note.title,
          content: JSON.parse(note.content),
          color: note.color as TNoteColor,
        })
        .select()
        .single();
      if (error) throw error;
      return rowToNote(data as INoteRow);
    },
    onSuccess: (created) => {
      queryClient.setQueryData<INote[]>(noteQk, old => [created, ...(old ?? [])]);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: noteQk }),
  });

  // ── Save note ──────────────────────────────────────────────────────────────
  const saveNoteMutation = useMutation({
    mutationFn: async (updated: INote) => {
      const { error } = await supabase
        .from("notes")
        .update({
          title: updated.title,
          content: JSON.parse(updated.content),
          color: updated.color,
          edited_at: updated.editedAt,
        })
        .eq("id", updated.id)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onMutate: async (updated) => {
      await queryClient.cancelQueries({ queryKey: noteQk });
      const previous = queryClient.getQueryData<INote[]>(noteQk);
      queryClient.setQueryData<INote[]>(noteQk, old =>
        (old ?? []).map(n => (n.id === updated.id ? updated : n))
      );
      return { previous };
    },
    onError: (_err, _note, context) => {
      queryClient.setQueryData(noteQk, context?.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: noteQk }),
  });

  // ── Delete notebook ────────────────────────────────────────────────────────
  const deleteNotebookMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notebooks")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: nbQk });
      await queryClient.cancelQueries({ queryKey: noteQk });
      const previousNb = queryClient.getQueryData<INotebook[]>(nbQk);
      const previousNotes = queryClient.getQueryData<INote[]>(noteQk);
      queryClient.setQueryData<INotebook[]>(nbQk, old => (old ?? []).filter(nb => nb.id !== id));
      // Reflect SET NULL — notes become standalone
      queryClient.setQueryData<INote[]>(noteQk, old =>
        (old ?? []).map(n => (n.notebookId === id ? { ...n, notebookId: null } : n))
      );
      return { previousNb, previousNotes };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(nbQk, context?.previousNb);
      queryClient.setQueryData(noteQk, context?.previousNotes);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: nbQk });
      queryClient.invalidateQueries({ queryKey: noteQk });
    },
  });

  // ── Delete note ────────────────────────────────────────────────────────────
  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: noteQk });
      const previous = queryClient.getQueryData<INote[]>(noteQk);
      queryClient.setQueryData<INote[]>(noteQk, old => (old ?? []).filter(n => n.id !== id));
      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(noteQk, context?.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: noteQk }),
  });

  return {
    notebooks,
    notes,
    isLoading,
    error: null,
    createNotebook: createNotebookMutation.mutateAsync,
    createNote: createNoteMutation.mutateAsync,
    saveNote: saveNoteMutation.mutate,
    deleteNotebook: (id: string) => deleteNotebookMutation.mutate(id),
    deleteNote: (id: string) => deleteNoteMutation.mutate(id),
  };
}
