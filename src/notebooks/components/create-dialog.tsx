"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ALL_COLORS, NOTE_COLOR_CLASSES } from "../constants";
import type { INote, INotebook, TNoteColor } from "../types";
import { cn } from "@/lib/utils";

type TMode = "notebook" | "note";

interface CreateDialogProps {
  open: boolean;
  mode: TMode;
  defaultNotebookId?: string | null;
  onClose: () => void;
  onCreateNotebook: (notebook: Omit<INotebook, "id" | "createdAt" | "editedAt">) => Promise<void>;
  onCreateNote: (note: Omit<INote, "id" | "createdAt" | "editedAt">) => Promise<void>;
}

const EMOJI_OPTIONS = ["📝", "📚", "🧬", "🎨", "📈", "💻", "🧠", "⚗️", "🌍", "🔬", "📐", "🎯", "🌱", "💡", "🔖"];

export function CreateDialog({
  open, mode, defaultNotebookId, onClose, onCreateNotebook, onCreateNote,
}: CreateDialogProps) {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("📝");
  const [color, setColor] = useState<TNoteColor>("default");

  const reset = () => { setTitle(""); setIcon("📝"); setColor("default"); };

  const handleClose = () => { reset(); onClose(); };

  const handleCreate = async () => {
    if (!title.trim()) return;

    if (mode === "notebook") {
      await onCreateNotebook({ title: title.trim(), icon, color });
    } else {
      await onCreateNote({
        notebookId: defaultNotebookId ?? null,
        title: title.trim(),
        content: JSON.stringify({ type: "doc", content: [{ type: "paragraph" }] }),
        color,
      });
    }
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={o => { if (!o) handleClose(); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{mode === "notebook" ? "New Notebook" : "New Note"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nb-title">Title</Label>
            <Input
              id="nb-title"
              autoFocus
              placeholder={mode === "notebook" ? "Notebook name…" : "Note title…"}
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleCreate(); }}
            />
          </div>

          {mode === "notebook" && (
            <div className="flex flex-col gap-1.5">
              <Label>Icon</Label>
              <div className="flex flex-wrap gap-1.5">
                {EMOJI_OPTIONS.map(e => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setIcon(e)}
                    aria-label={`Use ${e} as icon`}
                    aria-pressed={icon === e}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-md border text-base transition-colors",
                      icon === e ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground"
                    )}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label>Color</Label>
            <div className="flex gap-2">
              {ALL_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={`Select ${c} color`}
                  aria-pressed={color === c}
                  className={cn(
                    "h-6 w-6 rounded-full border-2 transition-transform",
                    NOTE_COLOR_CLASSES[c].dot,
                    color === c ? "border-foreground scale-110" : "border-transparent"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!title.trim()}>
            {mode === "notebook" ? "Create Notebook" : "Create Note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
