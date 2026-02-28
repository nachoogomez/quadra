"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { ITodo } from "../types";

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
        checked
          ? "border-primary bg-primary"
          : "border-border bg-transparent hover:border-muted-foreground"
      }`}
    >
      {checked && (
        <svg viewBox="0 0 10 8" className="h-2.5 w-2.5 fill-none stroke-primary-foreground stroke-2">
          <polyline points="1 4 4 7 9 1" />
        </svg>
      )}
    </button>
  );
}

export function TodoWidget({ initialTodos }: { initialTodos: ITodo[] }) {
  const [todos, setTodos] = useState(initialTodos);

  const toggle = (id: number) =>
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));

  return (
    <div className="rounded-xl bg-card border border-border p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-destructive">
            <svg viewBox="0 0 10 8" className="h-3 w-3 fill-none stroke-white stroke-2">
              <polyline points="1 4 4 7 9 1" />
            </svg>
          </span>
          Today&apos;s To-Do
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Plus size={16} />
        </button>
      </div>

      <ul className="flex flex-col gap-2.5">
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center gap-2.5">
            <Checkbox checked={todo.done} onChange={() => toggle(todo.id)} />
            <span className={`text-sm transition-colors ${todo.done ? "text-muted-foreground/50 line-through" : "text-foreground"}`}>
              {todo.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
