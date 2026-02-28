"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ITask, TColumn, TLabel } from "../types";
import { ALL_LABELS, COLUMNS, LABEL_COLORS } from "../constants";

interface EditTaskDialogProps {
  task: ITask | null;
  onClose: () => void;
  onSave: (task: ITask) => void;
}

export function EditTaskDialog({ task, onClose, onSave }: EditTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [column, setColumn] = useState<TColumn>("todo");
  const [selectedLabels, setSelectedLabels] = useState<TLabel[]>([]);
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setColumn(task.column);
      setSelectedLabels(task.labels);
      setDueDate(task.dueDate ?? "");
    }
  }, [task]);

  const toggleLabel = (label: TLabel) => {
    setSelectedLabels(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const handleSave = () => {
    if (!task || !title.trim()) return;
    onSave({
      ...task,
      title: title.trim(),
      description: description.trim() || undefined,
      labels: selectedLabels,
      dueDate: dueDate || undefined,
      column,
      completed: column === "completed",
    });
    onClose();
  };

  return (
    <Dialog open={!!task} onOpenChange={o => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSave()}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-description">
              Description <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="edit-description"
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
            <Label htmlFor="edit-due">
              Due date <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="edit-due"
              placeholder="e.g. Oct 15, Today..."
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!title.trim()}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
