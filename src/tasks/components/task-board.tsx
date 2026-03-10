"use client";

import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ITask, TColumn } from "../types";
import { COLUMNS } from "../constants";
import { TaskColumn } from "./task-column";
import { TaskCardContent } from "./task-card";
import { AddTaskDialog } from "./add-task-dialog";
import { EditTaskDialog } from "./edit-task-dialog";
import { useTasks } from "../hooks/use-tasks";

function TaskBoardSkeleton() {
  return (
    <div className="flex flex-col md:flex-row flex-1 gap-6 overflow-y-auto md:overflow-x-auto p-4 md:p-8">
      {[0, 1, 2].map(col => (
        <div key={col} className="flex w-full md:w-72 md:shrink-0 flex-col gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          {[0, 1, 2].map(i => (
            <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                <Skeleton className="h-4 flex-1" />
              </div>
              <Skeleton className="h-3 w-2/3 ml-6" />
              <div className="flex gap-1.5 ml-6">
                <Skeleton className="h-5 w-14 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

interface IProps {
  userId: string;
}

export function TaskBoard({ userId }: IProps) {
  const {
    tasks,
    isLoading,
    addTask,
    saveTask,
    deleteTask,
    toggleComplete,
    moveTaskColumn,
    reorderTasks,
  } = useTasks(userId);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState<TColumn>("todo");
  const [editingTask, setEditingTask] = useState<ITask | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [draggingOriginalColumn, setDraggingOriginalColumn] = useState<TColumn | null>(null);
  const [overColumnId, setOverColumnId] = useState<TColumn | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const draggingTask = draggingId ? tasks.find(t => t.id === draggingId) : null;
  const pendingCount = tasks.filter(t => !t.completed).length;

  const getColumnForItem = useCallback((id: string): TColumn | null => {
    const task = tasks.find(t => t.id === id);
    if (task) return task.column;
    if (COLUMNS.some(c => c.id === id)) return id as TColumn;
    return null;
  }, [tasks]);

  const handleDragStart = ({ active }: DragStartEvent) => {
    const task = tasks.find(t => t.id === active.id);
    setDraggingId(active.id as string);
    setDraggingOriginalColumn(task?.column ?? null);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) { setOverColumnId(null); return; }
    const overCol = getColumnForItem(over.id as string);
    setOverColumnId(overCol);

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask || !overCol || activeTask.column === overCol) return;

    moveTaskColumn(active.id as string, overCol);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setDraggingId(null);
    setOverColumnId(null);

    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    // Cross-column move: moveTaskColumn already updated local state optimistically,
    // now persist the new column + completed status to Supabase.
    if (draggingOriginalColumn !== null && activeTask.column !== draggingOriginalColumn) {
      setDraggingOriginalColumn(null);
      saveTask(activeTask);
      return;
    }

    setDraggingOriginalColumn(null);

    // Same-column reorder
    const overTask = tasks.find(t => t.id === over.id);
    if (!overTask || overTask.id === active.id) return;

    const colTasks = tasks.filter(t => t.column === activeTask.column);
    const oldIndex = colTasks.findIndex(t => t.id === active.id);
    const newIndex = colTasks.findIndex(t => t.id === overTask.id);
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

    reorderTasks(arrayMove(colTasks, oldIndex, newIndex));
  };

  const openAddDialog = (column: TColumn) => {
    setActiveColumn(column);
    setAddDialogOpen(true);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex items-center justify-between border-b border-border px-4 md:px-8 py-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Task Board</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading..." : `${pendingCount} tasks pending`}
          </p>
        </div>
        <Button onClick={() => openAddDialog("todo")} disabled={isLoading}>
          <Plus size={16} />
          Add Task
        </Button>
      </header>

      {isLoading ? <TaskBoardSkeleton /> : <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col md:flex-row flex-1 gap-6 overflow-y-auto md:overflow-x-auto p-4 md:p-8">
          {COLUMNS.map(col => (
            <TaskColumn
              key={col.id}
              column={col}
              tasks={tasks.filter(t => t.column === col.id)}
              onAddTask={openAddDialog}
              onToggleComplete={toggleComplete}
              onEdit={setEditingTask}
              onDelete={deleteTask}
              isOver={overColumnId === col.id && draggingTask?.column !== col.id}
            />
          ))}
        </div>

        <DragOverlay>
          {draggingTask && (
            <div className="rotate-1 scale-105 opacity-90 shadow-2xl">
              <TaskCardContent task={draggingTask} />
            </div>
          )}
        </DragOverlay>
      </DndContext>}

      <AddTaskDialog
        key={activeColumn}
        open={addDialogOpen}
        defaultColumn={activeColumn}
        onClose={() => setAddDialogOpen(false)}
        onAdd={addTask}
      />

      <EditTaskDialog
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={saveTask}
      />
    </div>
  );
}
