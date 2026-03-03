import { Plus, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoteCard } from "./note-card";
import type { INotebook, INote } from "../types";

interface NotesGridProps {
  notebook: INotebook;
  notes: INote[];
  onBack: () => void;
  onOpenNote: (note: INote) => void;
  onDeleteNote: (id: string) => void;
  onNewNote: () => void;
}

export function NotesGrid({ notebook, notes, onBack, onOpenNote, onDeleteNote, onNewNote }: NotesGridProps) {
  const notebookNotes = notes.filter(n => n.notebookId === notebook.id);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header / breadcrumb */}
      <div className="flex items-center justify-between border-b border-border px-8 py-3">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <button onClick={onBack} className="hover:text-foreground transition-colors">
            Notebooks
          </button>
          <ChevronRight size={14} />
          <span className="font-medium text-foreground">
            {notebook.icon} {notebook.title}
          </span>
        </nav>
        <Button size="sm" onClick={onNewNote}>
          <Plus size={14} />
          New Note
        </Button>
      </div>

      <div className="flex-1 overflow-auto px-8 py-6">
        {notebookNotes.length > 0 ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <FileText size={15} className="text-muted-foreground" />
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Notes
              </h2>
              <span className="text-xs text-muted-foreground/60">({notebookNotes.length})</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {notebookNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={() => onOpenNote(note)}
                  onDelete={onDeleteNote}
                />
              ))}
              <button
                onClick={onNewNote}
                className="flex h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-muted-foreground transition-colors hover:border-muted-foreground hover:text-foreground"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-current">
                  <Plus size={16} />
                </div>
                <span className="text-xs">New Note</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center pt-24">
            <div className="text-4xl">{notebook.icon}</div>
            <h3 className="text-base font-semibold text-foreground">{notebook.title}</h3>
            <p className="text-sm text-muted-foreground">This notebook is empty. Create your first note.</p>
            <Button onClick={onNewNote}>
              <Plus size={14} />
              New Note
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
