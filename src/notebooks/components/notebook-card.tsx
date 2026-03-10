import { BookOpen } from "lucide-react";
import { NOTE_COLOR_CLASSES } from "../constants";
import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
import type { INotebook, INote } from "../types";
import { cn } from "@/lib/utils";

interface NotebookCardProps {
  notebook: INotebook;
  notes: INote[];
  onClick: () => void;
  onDelete: () => void;
}

export function NotebookCard({ notebook, notes, onClick, onDelete }: NotebookCardProps) {
  const noteCount = notes.filter(n => n.notebookId === notebook.id).length;
  const { bg, dot } = NOTE_COLOR_CLASSES[notebook.color];

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border p-4 h-40 transition-all hover:border-muted-foreground/40 hover:shadow-sm",
        bg
      )}
    >
      {/* Stretched link — covers full card, sits behind content */}
      <button
        type="button"
        onClick={onClick}
        aria-label={`Open notebook: ${notebook.title}`}
        className="absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />

      <div className="relative z-10 flex items-start justify-between">
        <span className="text-3xl" aria-hidden="true">{notebook.icon}</span>
        <div onClick={e => e.stopPropagation()}>
          <ConfirmDeleteButton variant="icon" onConfirm={onDelete} />
        </div>
      </div>

      <div className="relative z-10 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground leading-tight">{notebook.title}</p>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
            {noteCount} {noteCount === 1 ? "note" : "notes"}
          </p>
        </div>
        <div className="flex items-center gap-1" aria-hidden="true">
          <span className={cn("h-2.5 w-2.5 rounded-full", dot)} />
          <BookOpen size={13} className="text-muted-foreground/50" />
        </div>
      </div>
    </div>
  );
}
