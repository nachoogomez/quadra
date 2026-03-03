"use client";

import { useState } from "react";
import { INITIAL_NOTEBOOKS, INITIAL_NOTES } from "../constants";
import type { INotebook, INote, TView } from "../types";
import { NotebooksGrid } from "./notebooks-grid";
import { NotesGrid } from "./notes-grid";
import { NoteEditor } from "./note-editor";
import { CreateDialog } from "./create-dialog";

export function NotebooksPage() {
  const [notebooks, setNotebooks] = useState<INotebook[]>(INITIAL_NOTEBOOKS);
  const [notes, setNotes] = useState<INote[]>(INITIAL_NOTES);

  const [view, setView] = useState<TView>("grid");
  const [activeNotebook, setActiveNotebook] = useState<INotebook | null>(null);
  const [activeNote, setActiveNote] = useState<INote | null>(null);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"notebook" | "note">("notebook");

  // ── Navigation ───────────────────────────────────────────────
  const openNotebook = (nb: INotebook) => {
    setActiveNotebook(nb);
    setView("notebook");
  };

  const openNote = (note: INote) => {
    setActiveNote(note);
    setView("editor");
  };

  const goBack = () => {
    if (view === "editor") {
      setActiveNote(null);
      setView(activeNotebook ? "notebook" : "grid");
    } else if (view === "notebook") {
      setActiveNotebook(null);
      setView("grid");
    }
  };

  // ── Dialogs ──────────────────────────────────────────────────
  const openNewNotebook = () => { setDialogMode("notebook"); setDialogOpen(true); };
  const openNewNote = () => { setDialogMode("note"); setDialogOpen(true); };

  // ── CRUD ─────────────────────────────────────────────────────
  const createNotebook = (nb: INotebook) => {
    setNotebooks(prev => [...prev, nb]);
  };

  const createNote = (note: INote) => {
    setNotes(prev => [...prev, note]);
    // Auto-open the newly created note
    setActiveNote(note);
    setView("editor");
  };

  const saveNote = (updated: INote) => {
    setNotes(prev => prev.map(n => (n.id === updated.id ? updated : n)));
    setActiveNote(updated);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeNote?.id === id) {
      setActiveNote(null);
      setView(activeNotebook ? "notebook" : "grid");
    }
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {view === "grid" && (
        <NotebooksGrid
          notebooks={notebooks}
          notes={notes}
          onOpenNotebook={openNotebook}
          onOpenNote={openNote}
          onDeleteNote={deleteNote}
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
          onDeleteNote={deleteNote}
          onNewNote={openNewNote}
        />
      )}

      {view === "editor" && activeNote && (
        <NoteEditor
          note={activeNote}
          notebook={activeNotebook}
          onBack={goBack}
          onBackToGrid={() => { setActiveNote(null); setActiveNotebook(null); setView("grid"); }}
          onSave={saveNote}
        />
      )}

      <CreateDialog
        open={dialogOpen}
        mode={dialogMode}
        defaultNotebookId={activeNotebook?.id ?? null}
        onClose={() => setDialogOpen(false)}
        onCreateNotebook={createNotebook}
        onCreateNote={createNote}
      />
    </div>
  );
}
