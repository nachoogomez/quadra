import { Plus, FolderOpen, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotebookCard } from "./notebook-card";
import { NoteCard } from "./note-card";
import type { INotebook, INote } from "../types";

interface NotebooksGridProps {
  notebooks: INotebook[];
  notes: INote[];
  onOpenNotebook: (notebook: INotebook) => void;
  onOpenNote: (note: INote) => void;
  onDeleteNote: (id: string) => void;
  onDeleteNotebook: (id: string) => void;
  onNewNotebook: () => void;
  onNewNote: () => void;
}

export function NotebooksGrid({
  notebooks, notes, onOpenNotebook, onOpenNote, onDeleteNote, onDeleteNotebook, onNewNotebook, onNewNote,
}: NotebooksGridProps) {
  const standaloneNotes = notes.filter(n => n.notebookId === null);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 md:px-8 py-3">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Notebooks</span>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onNewNote}>
            <FileText size={14} />
            New Note
          </Button>
          <Button size="sm" onClick={onNewNotebook}>
            <Plus size={14} />
            New Notebook
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-4 md:px-8 py-6 flex flex-col gap-8">
        {/* Notebooks section */}
        {notebooks.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <FolderOpen size={15} className="text-muted-foreground" />
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Notebooks
              </h2>
              <span className="text-xs text-muted-foreground/60">({notebooks.length})</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {notebooks.map(nb => (
                <NotebookCard
                  key={nb.id}
                  notebook={nb}
                  notes={notes}
                  onClick={() => onOpenNotebook(nb)}
                  onDelete={() => onDeleteNotebook(nb.id)}
                />
              ))}
              {/* New notebook placeholder */}
              <button
                onClick={onNewNotebook}
                className="flex h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-muted-foreground transition-colors hover:border-muted-foreground hover:text-foreground"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-current">
                  <Plus size={16} />
                </div>
                <span className="text-xs">New Notebook</span>
              </button>
            </div>
          </section>
        )}

        {/* Standalone notes section */}
        {standaloneNotes.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <FileText size={15} className="text-muted-foreground" />
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Notes
              </h2>
              <span className="text-xs text-muted-foreground/60">({standaloneNotes.length})</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {standaloneNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={() => onOpenNote(note)}
                  onDelete={onDeleteNote}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {notebooks.length === 0 && standaloneNotes.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <div className="text-4xl">📝</div>
            <h3 className="text-base font-semibold text-foreground">No notebooks yet</h3>
            <p className="text-sm text-muted-foreground">Create a notebook to organize your notes.</p>
            <Button onClick={onNewNotebook}>
              <Plus size={14} />
              New Notebook
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
