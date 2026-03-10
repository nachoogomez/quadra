"use client";

import { useMemo } from "react";
import { Search, Bell } from "lucide-react";
import { ScheduleWidget } from "./schedule-widget";
import { NotebooksWidget } from "./notebooks-widget";
import { TodoWidget } from "./todo-widget";
import { useUserStore } from "@/lib/stores/user-store";
import { Skeleton } from "@/components/ui/skeleton";
import { useTasks } from "@/tasks/hooks/use-tasks";
import { useCalendarEvents } from "@/calendar/hooks/use-calendar-events";
import { useRoutineBlocks } from "@/routine/hooks/use-routine-blocks";
import { useNotebooksData } from "@/notebooks/hooks/use-notebooks-data";
import type { IScheduleItem, INotebook, ITodo } from "../types";
import type { IUser } from "@/calendar/interfaces";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const COLOR_CLASS: Record<string, string> = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  red: "bg-red-500",
  yellow: "bg-yellow-400",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  gray: "bg-gray-400",
};

function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 || 12;
  const m = minute.toString().padStart(2, "0");
  return `${h}:${m} ${period}`;
}

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

/** Converts JS getDay() (0=Sun) to routine dayOfWeek (0=Mon) */
function getTodayRoutineDay(): number {
  return (new Date().getDay() + 6) % 7;
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="flex flex-1 flex-col lg:flex-row gap-6 min-w-0 p-4 md:p-8">
      {/* Left column */}
      <div className="flex flex-1 flex-col gap-6 min-w-0">
        {/* Schedule widget */}
        <div className="rounded-xl bg-card border border-border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-20" />
          </div>
          {[0, 1, 2].map(i => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-3 w-14 mt-3 shrink-0" />
              <Skeleton className="w-0.5 self-stretch rounded-full" />
              <div className="flex-1 rounded-lg bg-muted/50 p-3 space-y-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
        {/* Todo skeleton — mobile only */}
        <div className="lg:hidden rounded-xl bg-card border border-border p-4 space-y-3">
          <Skeleton className="h-4 w-28" />
          {[0, 1, 2].map(i => (
            <div key={i} className="flex items-center gap-2.5">
              <Skeleton className="h-4 w-4 rounded shrink-0" />
              <Skeleton className="h-3 flex-1" />
            </div>
          ))}
        </div>
        {/* Notebooks widget */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-28" />
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2].map(i => (
              <div key={i} className="rounded-xl bg-card border border-border p-4 h-36 flex flex-col justify-end space-y-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-2 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Right column — desktop only */}
      <div className="hidden lg:flex lg:w-64 lg:shrink-0 flex-col gap-4">
        <div className="rounded-xl bg-card border border-border p-4 space-y-3">
          <Skeleton className="h-4 w-28" />
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-2.5">
              <Skeleton className="h-4 w-4 rounded shrink-0" />
              <Skeleton className="h-3 flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const user = useUserStore(s => s.user);
  const userId = user?.id ?? "";

  const calendarUser: IUser = useMemo(
    () => ({ id: userId, name: user?.fullName ?? "", picturePath: user?.avatarUrl ?? null }),
    [userId, user?.fullName, user?.avatarUrl]
  );

  const { tasks, isLoading: tasksLoading, toggleComplete } = useTasks(userId);
  const { events, isLoading: eventsLoading } = useCalendarEvents(calendarUser);
  const { blocks, isLoading: blocksLoading } = useRoutineBlocks(userId);
  const { notebooks, isLoading: notebooksLoading } = useNotebooksData(userId);

  const isLoading = tasksLoading || eventsLoading || blocksLoading || notebooksLoading;

  // ── Schedule: today's calendar events + today's routine blocks ────────────
  const scheduleItems = useMemo((): IScheduleItem[] => {
    const todayDay = getTodayRoutineDay();

    type Sortable = IScheduleItem & { _sortKey: number };

    const eventItems: Sortable[] = events
      .filter(e => isToday(e.startDate))
      .map(e => {
        const d = new Date(e.startDate);
        return {
          _sortKey: d.getHours() * 60 + d.getMinutes(),
          time: formatTime(d.getHours(), d.getMinutes()),
          title: e.title,
          subtitle: e.description || "",
          color: COLOR_CLASS[e.color] ?? "bg-blue-500",
          avatars: [],
        };
      });

    const routineItems: Sortable[] = blocks
      .filter(b => b.dayOfWeek === todayDay)
      .map(b => ({
        _sortKey: b.startHour * 60 + b.startMinute,
        time: formatTime(b.startHour, b.startMinute),
        title: b.title,
        subtitle: b.location || b.description || "",
        color: COLOR_CLASS[b.color] ?? "bg-gray-400",
        avatars: [],
      }));

    return [...eventItems, ...routineItems]
      .sort((a, b) => a._sortKey - b._sortKey)
      .map(({ _sortKey: _, ...item }) => item);
  }, [events, blocks]);

  // ── Notebooks: last 3 edited ──────────────────────────────────────────────
  const notebookItems = useMemo(
    (): INotebook[] =>
      notebooks.slice(0, 3).map(nb => ({
        id: nb.id,
        icon: nb.icon,
        title: nb.title,
        description: "",
        edited: formatRelativeTime(nb.editedAt),
      })),
    [notebooks]
  );

  // ── Todos: pending tasks (not completed) ──────────────────────────────────
  const todoItems = useMemo(
    (): ITodo[] =>
      tasks
        .filter(t => !t.completed)
        .map(t => ({ id: t.id, label: t.title, done: false })),
    [tasks]
  );

  const pendingCount = todoItems.length;
  const eventsCount = scheduleItems.length;

  if (isLoading) return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex items-center justify-between border-b border-border px-4 md:px-8 py-3">
        <Skeleton className="h-4 w-40" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-5 rounded-md" />
          <Skeleton className="h-5 w-5 rounded-md" />
        </div>
      </header>
      <div className="flex flex-col p-8 gap-4">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-4 w-56" />
      </div>
      <DashboardSkeleton />
    </div>
  );

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex items-center justify-between border-b border-border px-4 md:px-8 py-3">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <span className="hover:text-foreground cursor-pointer transition-colors">Dashboard</span>
          <span className="mx-1">/</span>
          <span className="font-medium text-foreground">Home</span>
        </nav>
        <div className="flex items-center gap-4">
          <button aria-label="Search" className="text-muted-foreground hover:text-foreground transition-colors">
            <Search size={18} />
          </button>
          <button aria-label="Notifications" className="relative text-muted-foreground hover:text-foreground transition-colors">
            <Bell size={18} />
            {pendingCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-2 w-2 items-center justify-center rounded-full bg-destructive" />
            )}
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-auto p-4 md:p-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back{user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}! 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {pendingCount > 0 || eventsCount > 0
              ? `You have ${pendingCount} pending task${pendingCount !== 1 ? "s" : ""} and ${eventsCount} event${eventsCount !== 1 ? "s" : ""} today.`
              : "Everything is up to date. Have a great day!"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 gap-6 min-w-0">
          {/* Left column */}
          <div className="flex flex-1 flex-col gap-6 min-w-0">
            <ScheduleWidget items={scheduleItems} />
            {/* Todo between schedule and notebooks on mobile */}
            <div className="lg:hidden">
              <TodoWidget todos={todoItems} onToggle={toggleComplete} />
            </div>
            <NotebooksWidget notebooks={notebookItems} />
          </div>

          {/* Right column — desktop only */}
          <div className="hidden lg:flex lg:w-64 lg:shrink-0 flex-col gap-4">
            <TodoWidget todos={todoItems} onToggle={toggleComplete} />
          </div>
        </div>
      </div>
    </div>
  );
}
