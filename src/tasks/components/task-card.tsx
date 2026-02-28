"use client";

import { useState } from "react";
import { CheckCircle2, Circle, GripVertical, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { ITask } from "../types";
import { LABEL_COLORS } from "../constants";

interface TaskCardContentProps {
  task: ITask;
  onToggleComplete?: (id: string) => void;
  onEdit?: (task: ITask) => void;
  onDelete?: (id: string) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function TaskCardContent({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  dragHandleProps,
}: TaskCardContentProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="group rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <button
            onClick={() => onToggleComplete?.(task.id)}
            className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary transition-colors"
          >
            {task.completed
              ? <CheckCircle2 size={16} className="text-primary" />
              : <Circle size={16} />}
          </button>
          <p className={`text-sm font-medium leading-snug ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
            {task.title}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <div
            {...dragHandleProps}
            className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-all touch-none"
          >
            <GripVertical size={14} />
          </div>

          <Popover open={menuOpen} onOpenChange={setMenuOpen}>
            <PopoverTrigger asChild>
              <button className="opacity-0 group-hover:opacity-100 rounded-md p-0.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
                <MoreHorizontal size={16} />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-36 p-1">
              <button
                onClick={() => { onEdit?.(task); setMenuOpen(false); }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-accent transition-colors"
              >
                <Pencil size={13} className="text-muted-foreground" />
                Edit
              </button>
              <button
                onClick={() => { onDelete?.(task.id); setMenuOpen(false); }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 size={13} />
                Delete
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {task.description && (
        <p className="mt-2 ml-6 text-xs text-muted-foreground line-clamp-2">{task.description}</p>
      )}

      {task.labels.length > 0 && (
        <div className="mt-3 ml-6 flex flex-wrap gap-1.5">
          {task.labels.map(label => (
            <span
              key={label}
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${LABEL_COLORS[label]}`}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {(task.avatar || task.dueDate) && (
        <div className="mt-3 ml-6 flex items-center justify-between">
          {task.dueDate && (
            <span className={`ml-auto text-xs font-medium ${task.dueDate === "Today" ? "text-destructive" : "text-muted-foreground"}`}>
              Due {task.dueDate}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
