"use client";

import { Plus, MoreHorizontal } from "lucide-react";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ITask, TColumn } from "../types";
import { TaskCardContent } from "./task-card";

// ── SortableTaskCard ──────────────────────────────────────────────────────────

function SortableTaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: {
  task: ITask;
  onToggleComplete: (id: string) => void;
  onEdit: (task: ITask) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskCardContent
        task={task}
        onToggleComplete={onToggleComplete}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

// ── TaskColumn ────────────────────────────────────────────────────────────────

interface TaskColumnProps {
  column: { id: TColumn; title: string };
  tasks: ITask[];
  onAddTask: (column: TColumn) => void;
  onToggleComplete: (id: string) => void;
  onEdit: (task: ITask) => void;
  onDelete: (id: string) => void;
  isOver: boolean;
}

export function TaskColumn({
  column,
  tasks,
  onAddTask,
  onToggleComplete,
  onEdit,
  onDelete,
  isOver,
}: TaskColumnProps) {
  return (
    <div className="flex w-72 shrink-0 flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
            {tasks.length}
          </span>
          <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAddTask(column.id)}
            className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <Plus size={16} />
          </button>
          <button className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Drop zone */}
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div
          className={`flex flex-col gap-3 min-h-[60px] rounded-xl transition-colors ${
            isOver ? "bg-accent/40 ring-1 ring-border" : ""
          }`}
        >
          {tasks.map(task => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>

      {/* Add new */}
      <button
        onClick={() => onAddTask(column.id)}
        className="flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-muted-foreground hover:text-foreground"
      >
        <Plus size={16} />
        New
      </button>
    </div>
  );
}
