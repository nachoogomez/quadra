import { BookOpen } from "lucide-react";
import { NOTE_COLOR_CLASSES } from "../constants";
import type { INotebook, INote } from "../types";
import { cn } from "@/lib/utils";

interface NotebookCardProps {
  notebook: INotebook;
  notes: INote[];
  onClick: () => void;
}

export function NotebookCard({ notebook, notes, onClick }: NotebookCardProps) {
  const noteCount = notes.filter(n => n.notebookId === notebook.id).length;
  const { bg, dot } = NOTE_COLOR_CLASSES[notebook.color];

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border p-4 text-left h-40 transition-all hover:border-muted-foreground/40 hover:shadow-sm",
        bg
      )}
    >
      <span className="text-3xl">{notebook.icon}</span>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground leading-tight">{notebook.title}</p>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
            {noteCount} {noteCount === 1 ? "note" : "notes"}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <span className={cn("h-2.5 w-2.5 rounded-full", dot)} />
          <BookOpen size={13} className="text-muted-foreground/50" />
        </div>
      </div>
    </button>
  );
}
