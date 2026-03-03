"use client";

import { FileText, MoreHorizontal, Trash2 } from "lucide-react";
import { NOTE_COLOR_CLASSES } from "../constants";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { INote } from "../types";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NoteCardProps {
  note: INote;
  onClick: () => void;
  onDelete: (id: string) => void;
}

function getPreview(content: string): string {
  try {
    const doc = JSON.parse(content);
    const texts: string[] = [];
    const walk = (node: { type?: string; text?: string; content?: typeof node[] }) => {
      if (node.text) texts.push(node.text);
      if (node.content) node.content.forEach(walk);
    };
    walk(doc);
    return texts.join(" ").slice(0, 120);
  } catch {
    return "";
  }
}

export function NoteCard({ note, onClick, onDelete }: NoteCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { bg, dot } = NOTE_COLOR_CLASSES[note.color];
  const preview = getPreview(note.content);

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border p-4 h-40 transition-all hover:border-muted-foreground/40 hover:shadow-sm cursor-pointer",
        bg
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <FileText size={14} className="shrink-0 text-muted-foreground/60" />
          <p className="text-sm font-semibold text-foreground truncate">{note.title}</p>
        </div>
        <Popover open={menuOpen} onOpenChange={setMenuOpen}>
          <PopoverTrigger asChild>
            <button
              onClick={e => { e.stopPropagation(); }}
              className="shrink-0 opacity-0 group-hover:opacity-100 rounded p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <MoreHorizontal size={15} />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-32 p-1" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => { onDelete(note.id); setMenuOpen(false); }}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 size={13} />
              Delete
            </button>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex-1 mt-2 overflow-hidden">
        <p className="text-xs text-muted-foreground line-clamp-3">{preview || "Empty note"}</p>
      </div>

      <div className="flex items-center justify-between mt-2">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
          Edited {note.editedAt}
        </p>
        <span className={cn("h-2 w-2 rounded-full", dot)} />
      </div>
    </div>
  );
}
