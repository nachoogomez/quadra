"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface ConfirmDeleteButtonProps {
  onConfirm: () => void;
  /**
   * "button"    — botón con texto (footers de dialogs)
   * "icon"      — solo icono trash (cards)
   * "menu-item" — fila full-width dentro de un Popover/menú
   */
  variant?: "button" | "icon" | "menu-item";
  className?: string;
}

export function ConfirmDeleteButton({
  onConfirm,
  variant = "button",
  className,
}: ConfirmDeleteButtonProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    setOpen(false);
    onConfirm();
  };

  const modal = (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirm deletion</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to delete this item?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <button className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors">
              Cancel
            </button>
          </DialogClose>
          <button
            onClick={handleConfirm}
            className="inline-flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors"
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  if (variant === "menu-item") {
    return (
      <>
        {modal}
        <button
          onClick={() => setOpen(true)}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors",
            className
          )}
        >
          <Trash2 size={13} />
          Delete
        </button>
      </>
    );
  }

  if (variant === "icon") {
    return (
      <>
        {modal}
        <button
          onClick={() => setOpen(true)}
          className={cn(
            "opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive",
            className
          )}
        >
          <Trash2 size={14} />
        </button>
      </>
    );
  }

  // variant === "button"
  return (
    <>
      {modal}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-2 rounded-md border border-destructive/40 px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors",
          className
        )}
      >
        <Trash2 size={14} />
        Delete
      </button>
    </>
  );
}
