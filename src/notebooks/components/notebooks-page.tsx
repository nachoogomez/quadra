"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useNotebooksData } from "../hooks/use-notebooks-data";
import type { INotebook, INote, TView } from "../types";
import { NotebooksGrid } from "./notebooks-grid";
import { NotesGrid } from "./notes-grid";
import { NoteEditor } from "./note-editor";
import { CreateDialog } from "./create-dialog";
import { Skeleton } from "@/components/ui/skeleton";

function NotebooksSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 md:px-8 py-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
      <div className="p-4 md:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 h-40 flex flex-col justify-between">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface IProps {
  userId: string;
}

export function NotebooksPage({ userId }: IProps) {
  const { notebooks, notes, isLoading, createNotebook, createNote, saveNote, deleteNote, deleteNotebook } = useNotebooksData(userId);

  const [view, setView] = useState<TView>("grid");
  const [activeNotebook, setActiveNotebook] = useState<INotebook | null>(null);
  const [activeNote, setActiveNote] = useState<INote | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoading) return;
    const notebookId = searchParams.get("notebook");
    if (!notebookId) return;
    const match = notebooks.find(nb => nb.id === notebookId);
    if (match) { setActiveNotebook(match); setView("notebook"); }
  }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"notebook" | "note">("notebook");

  // Navigation
  const openNotebook = useCallback((nb: INotebook) => { setActiveNotebook(nb); setView("notebook"); }, []);
  const openNote = useCallback((note: INote) => { setActiveNote(note); setView("editor"); }, []);
  const goBack = useCallback(() => {
    if (view === "editor") { setActiveNote(null); setView(activeNotebook ? "notebook" : "grid"); }
    else if (view === "notebook") { setActiveNotebook(null); setView("grid"); }
  }, [view, activeNotebook]);
  const backToGrid = useCallback(() => { setActiveNote(null); setActiveNotebook(null); setView("grid"); }, []);

  // Dialogs
  const openNewNotebook = useCallback(() => { setDialogMode("notebook"); setDialogOpen(true); }, []);
  const openNewNote = useCallback(() => { setDialogMode("note"); setDialogOpen(true); }, []);

  // CRUD
  const handleCreateNotebook = async (nb: Omit<INotebook, "id" | "createdAt" | "editedAt">) => {
    await createNotebook(nb);
  };

  const handleCreateNote = async (note: Omit<INote, "id" | "createdAt" | "editedAt">) => {
    const created = await createNote(note);
    if (created) { setActiveNote(created); setView("editor"); }
  };

  const handleSaveNote = async (updated: INote) => {
    await saveNote(updated);
    setActiveNote(updated);
  };

  const handleDeleteNote = async (id: string) => {
    await deleteNote(id);
    if (activeNote?.id === id) { setActiveNote(null); setView(activeNotebook ? "notebook" : "grid"); }
  };

  const handleDeleteNotebook = async (id: string) => {
    await deleteNotebook(id);
    if (activeNotebook?.id === id) { setActiveNotebook(null); setView("grid"); }
  };

  if (isLoading) return <NotebooksSkeleton />;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {view === "grid" && (
        <NotebooksGrid
          notebooks={notebooks}
          notes={notes}
          onOpenNotebook={openNotebook}
          onOpenNote={openNote}
          onDeleteNote={handleDeleteNote}
          onDeleteNotebook={handleDeleteNotebook}
          onNewNotebook={openNewNotebook}
          onNewNote={openNewNote}
        />
      )}

      {view === "notebook" && activeNotebook && (
        <NotesGrid
          notebook={activeNotebook}
          notes={notes}
          onBack={goBack}
          onOpenNote={openNote}
          onDeleteNote={handleDeleteNote}
          onNewNote={openNewNote}
        />
      )}

      {view === "editor" && activeNote && (
        <NoteEditor
          note={activeNote}
          notebook={activeNotebook}
          onBack={goBack}
          onBackToGrid={backToGrid}
          onSave={handleSaveNote}
        />
      )}

      <CreateDialog
        open={dialogOpen}
        mode={dialogMode}
        defaultNotebookId={activeNotebook?.id ?? null}
        onClose={() => setDialogOpen(false)}
        onCreateNotebook={handleCreateNotebook}
        onCreateNote={handleCreateNote}
      />
    </div>
  );
}
