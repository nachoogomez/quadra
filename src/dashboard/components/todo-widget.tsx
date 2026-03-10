"use client";

import { Plus } from "lucide-react";
import type { ITodo } from "../types";

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      onClick={onChange}
      aria-label={`${checked ? "Uncheck" : "Check"} "${label}"`}
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
        checked
          ? "border-primary bg-primary"
          : "border-border bg-transparent hover:border-muted-foreground"
      }`}
    >
      {checked && (
        <svg viewBox="0 0 10 8" aria-hidden="true" className="h-2.5 w-2.5 fill-none stroke-primary-foreground stroke-2">
          <polyline points="1 4 4 7 9 1" />
        </svg>
      )}
    </button>
  );
}

interface TodoWidgetProps {
  todos: ITodo[];
  onToggle: (id: string) => void;
}

export function TodoWidget({ todos, onToggle }: TodoWidgetProps) {
  return (
    <div className="rounded-xl bg-card border border-border p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-destructive" aria-hidden="true">
            <svg viewBox="0 0 10 8" className="h-3 w-3 fill-none stroke-white stroke-2">
              <polyline points="1 4 4 7 9 1" />
            </svg>
          </span>
          Today&apos;s To-Do
        </div>
        <button aria-label="Add task" className="text-muted-foreground hover:text-foreground transition-colors">
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>

      {todos.length === 0 ? (
        <p className="text-sm text-muted-foreground/60 text-center py-3">No pending tasks</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {todos.map(todo => (
            <li key={todo.id} className="flex items-center gap-2.5">
              <Checkbox checked={todo.done} onChange={() => onToggle(todo.id)} label={todo.label} />
              <span className={`text-sm transition-colors ${todo.done ? "text-muted-foreground/50 line-through" : "text-foreground"}`}>
                {todo.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
