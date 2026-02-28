import { Search, Bell } from "lucide-react";
import { ScheduleWidget } from "./schedule-widget";
import { NotebooksWidget } from "./notebooks-widget";
import { TodoWidget } from "./todo-widget";
import { SCHEDULE, NOTEBOOKS, INITIAL_TODOS } from "../mocks";

export function DashboardPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex items-center justify-between border-b border-border px-8 py-3">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <span className="hover:text-foreground cursor-pointer transition-colors">Dashboard</span>
          <span className="mx-1">/</span>
          <span className="font-medium text-foreground">Home</span>
        </nav>
        <div className="flex items-center gap-4">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Search size={18} />
          </button>
          <button className="relative text-muted-foreground hover:text-foreground transition-colors">
            <Bell size={18} />
            <span className="absolute -right-1 -top-1 flex h-2 w-2 items-center justify-center rounded-full bg-destructive" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-auto p-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, Jane! 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            You have 4 tasks due today and 2 lectures coming up.
          </p>
        </div>

        <div className="flex flex-1 gap-6 min-w-0">
          {/* Left column */}
          <div className="flex flex-1 flex-col gap-6 min-w-0">
            <ScheduleWidget items={SCHEDULE} />
            <NotebooksWidget notebooks={NOTEBOOKS} />
          </div>

          {/* Right column */}
          <div className="flex w-64 shrink-0 flex-col gap-4">
            <TodoWidget initialTodos={INITIAL_TODOS} />
          </div>
        </div>
      </div>
    </div>
  );
}
