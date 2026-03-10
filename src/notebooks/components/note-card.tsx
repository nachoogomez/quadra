"use client";

import { FileText, MoreHorizontal } from "lucide-react";
import { NOTE_COLOR_CLASSES } from "../constants";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
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
        "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border p-4 h-40 transition-all hover:border-muted-foreground/40 hover:shadow-sm",
        bg
      )}
    >
      {/* Stretched link — covers full card, sits behind content */}
      <button
        type="button"
        onClick={onClick}
        aria-label={`Open note: ${note.title}`}
        className="absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />

      <div className="relative z-10 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <FileText size={14} className="shrink-0 text-muted-foreground/60" aria-hidden="true" />
          <p className="text-sm font-semibold text-foreground truncate">{note.title}</p>
        </div>
        <Popover open={menuOpen} onOpenChange={setMenuOpen}>
          <PopoverTrigger asChild>
            <button
              onClick={e => { e.stopPropagation(); }}
              aria-label="Note options"
              className="relative z-10 shrink-0 opacity-0 group-hover:opacity-100 rounded p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <MoreHorizontal size={15} aria-hidden="true" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-36 p-1" onClick={e => e.stopPropagation()}>
            <ConfirmDeleteButton
              variant="menu-item"
              onConfirm={() => { onDelete(note.id); setMenuOpen(false); }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="relative z-10 flex-1 mt-2 overflow-hidden">
        <p className="text-xs text-muted-foreground line-clamp-3">{preview || "Empty note"}</p>
      </div>

      <div className="relative z-10 flex items-center justify-between mt-2">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
          Edited {note.editedAt}
        </p>
        <span className={cn("h-2 w-2 rounded-full", dot)} aria-hidden="true" />
      </div>
    </div>
  );
}
