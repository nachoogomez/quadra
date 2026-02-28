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
import type { ITask, TColumn } from "../types";
import { COLUMNS, INITIAL_TASKS } from "../constants";
import { TaskColumn } from "./task-column";
import { TaskCardContent } from "./task-card";
import { AddTaskDialog } from "./add-task-dialog";
import { EditTaskDialog } from "./edit-task-dialog";

export function TaskBoard() {
  const [tasks, setTasks] = useState<ITask[]>(INITIAL_TASKS);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState<TColumn>("todo");
  const [editingTask, setEditingTask] = useState<ITask | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
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
    setDraggingId(active.id as string);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) { setOverColumnId(null); return; }
    const overCol = getColumnForItem(over.id as string);
    setOverColumnId(overCol);

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask || !overCol || activeTask.column === overCol) return;

    setTasks(prev =>
      prev.map(t =>
        t.id === active.id
          ? { ...t, column: overCol, completed: overCol === "completed" }
          : t
      )
    );
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setDraggingId(null);
    setOverColumnId(null);

    if (!over) return;
    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    const overTaskId = tasks.find(t => t.id === over.id) ? over.id as string : null;
    if (!overTaskId || overTaskId === active.id) return;

    setTasks(prev => {
      const colTasks = prev.filter(t => t.column === activeTask.column);
      const oldIndex = colTasks.findIndex(t => t.id === active.id);
      const newIndex = colTasks.findIndex(t => t.id === overTaskId);
      if (oldIndex === -1 || newIndex === -1) return prev;
      const reordered = arrayMove(colTasks, oldIndex, newIndex);
      return [...prev.filter(t => t.column !== activeTask.column), ...reordered];
    });
  };

  const openAddDialog = (column: TColumn) => {
    setActiveColumn(column);
    setAddDialogOpen(true);
  };

  const addTask = (task: ITask) => setTasks(prev => [...prev, task]);

  const saveTask = (updated: ITask) =>
    setTasks(prev => prev.map(t => (t.id === updated.id ? updated : t)));

  const deleteTask = (id: string) =>
    setTasks(prev => prev.filter(t => t.id !== id));

  const toggleComplete = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== id) return t;
        const nowComplete = !t.completed;
        return { ...t, completed: nowComplete, column: nowComplete ? "completed" : "todo" };
      })
    );
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex items-center justify-between border-b border-border px-8 py-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Task Board</h1>
          <p className="text-sm text-muted-foreground">{pendingCount} tasks pending</p>
        </div>
        <Button onClick={() => openAddDialog("todo")}>
          <Plus size={16} />
          Add Task
        </Button>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-1 gap-6 overflow-x-auto p-8">
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
      </DndContext>

      <AddTaskDialog
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
