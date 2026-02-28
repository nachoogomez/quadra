import Link from "next/link";
import { Calendar, ExternalLink } from "lucide-react";
import type { IScheduleItem } from "../types";

export function ScheduleWidget({ items }: { items: IScheduleItem[] }) {
  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <Calendar size={18} className="text-muted-foreground" />
          Upcoming Schedule
        </div>
        <Link
          href="/calendar/month"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          View Calendar
          <ExternalLink size={12} />
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {items.map(item => (
          <div key={item.title} className="flex items-start gap-3">
            <span className="w-16 shrink-0 pt-3 text-right text-xs text-muted-foreground/60">
              {item.time}
            </span>
            <div className={`w-0.5 self-stretch rounded-full ${item.color}`} />
            <div className={`flex-1 rounded-lg p-3 ${item.muted ? "opacity-30" : "bg-muted/50"}`}>
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.subtitle}</p>
              {item.avatars.length > 0 && (
                <div className="mt-2 flex gap-1">
                  {item.avatars.map((a, i) => (
                    <span
                      key={i}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
