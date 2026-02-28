"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ITask, TColumn, TLabel } from "../types";
import { ALL_LABELS, COLUMNS, LABEL_COLORS } from "../constants";

interface AddTaskDialogProps {
  open: boolean;
  defaultColumn: TColumn;
  onClose: () => void;
  onAdd: (task: ITask) => void;
}

export function AddTaskDialog({ open, defaultColumn, onClose, onAdd }: AddTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [column, setColumn] = useState<TColumn>(defaultColumn);
  const [selectedLabels, setSelectedLabels] = useState<TLabel[]>([]);
  const [dueDate, setDueDate] = useState("");

  const toggleLabel = (label: TLabel) => {
    setSelectedLabels(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd({
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim() || undefined,
      labels: selectedLabels,
      dueDate: dueDate || undefined,
      avatar: "JS",
      column,
      completed: column === "completed",
    });
    setTitle("");
    setDescription("");
    setSelectedLabels([]);
    setDueDate("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={o => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Task title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAdd()}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">
              Description <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Add a description..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Column</Label>
            <Select value={column} onValueChange={v => setColumn(v as TColumn)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COLUMNS.map(col => (
                  <SelectItem key={col.id} value={col.id}>{col.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Labels</Label>
            <div className="flex flex-wrap gap-2">
              {ALL_LABELS.map(label => (
                <button
                  key={label}
                  onClick={() => toggleLabel(label)}
                  className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium transition-all ${
                    selectedLabels.includes(label)
                      ? LABEL_COLORS[label]
                      : "border-border text-muted-foreground hover:border-muted-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="due">
              Due date <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="due"
              placeholder="e.g. Oct 15, Today..."
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAdd} disabled={!title.trim()}>Add Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
