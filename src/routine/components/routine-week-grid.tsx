"use client";

import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRoutine } from "@/routine/context";
import { RoutineBlockDialog } from "./dialogs/routine-block-dialog";
import { RoutineBlockCard } from "./routine-block-card";
import type { IRoutineBlock, TWeekDay } from "@/routine/types";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const FULL_DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Visible hours: 6am to 11pm
const START_HOUR = 6;
const END_HOUR = 23;
const TOTAL_HOURS = END_HOUR - START_HOUR;
const HOUR_HEIGHT = 64; // px per hour
const TOTAL_HEIGHT = TOTAL_HOURS * HOUR_HEIGHT;

function formatHourLabel(h: number) {
  if (h === 0) return "12 AM";
  if (h === 12) return "12 PM";
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
}

function getBlockStyle(block: IRoutineBlock): React.CSSProperties {
  const startMinutes = (block.startHour - START_HOUR) * 60 + block.startMinute;
  const endMinutes = (block.endHour - START_HOUR) * 60 + block.endMinute;
  const top = (startMinutes / 60) * HOUR_HEIGHT;
  const height = Math.max(((endMinutes - startMinutes) / 60) * HOUR_HEIGHT, 20);
  return { top: `${top}px`, height: `${height}px` };
}

interface IDayColumnProps {
  dayIndex: TWeekDay;
  blocks: IRoutineBlock[];
}

function DayColumn({ dayIndex, blocks }: IDayColumnProps) {
  const dayBlocks = blocks.filter(b => b.dayOfWeek === dayIndex);

  return (
    <div className="relative flex-1 border-l border-border min-w-0">
      {/* Hour grid lines */}
      {Array.from({ length: TOTAL_HOURS }, (_, i) => (
        <div key={i} style={{ height: `${HOUR_HEIGHT}px` }} className="border-b border-border/50 relative">
          <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-border/30" />
        </div>
      ))}

      {/* Clickable add slots */}
      {Array.from({ length: TOTAL_HOURS * 2 }, (_, i) => {
        const hour = START_HOUR + Math.floor(i / 2);
        const minute = (i % 2) * 30;
        return (
          <RoutineBlockDialog key={i} defaultDay={dayIndex} defaultHour={hour}>
            <div
              className="absolute inset-x-0 cursor-pointer hover:bg-accent/40 transition-colors group"
              style={{ top: `${(i * HOUR_HEIGHT) / 2}px`, height: `${HOUR_HEIGHT / 2}px` }}
              title={`Add on ${FULL_DAY_LABELS[dayIndex]} ${hour}:${minute === 0 ? "00" : "30"}`}
            >
              <div className="hidden group-hover:flex items-center justify-center h-full">
                <Plus size={12} className="text-muted-foreground" />
              </div>
            </div>
          </RoutineBlockDialog>
        );
      })}

      {/* Blocks */}
      {dayBlocks.map(block => (
        <RoutineBlockCard key={block.id} block={block} style={getBlockStyle(block)} />
      ))}
    </div>
  );
}

export function RoutineWeekGrid() {
  const { blocks } = useRoutine();

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="flex border-b border-border shrink-0">
        <div className="w-16 shrink-0" />
        {DAY_LABELS.map((label, i) => (
          <div key={i} className="flex-1 border-l border-border py-2 text-center min-w-0">
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* Scrollable grid */}
      <ScrollArea className="flex-1" type="always">
        <div className="flex" style={{ height: `${TOTAL_HEIGHT}px` }}>
          {/* Hours column */}
          <div className="w-16 shrink-0 relative">
            {Array.from({ length: TOTAL_HOURS }, (_, i) => {
              const hour = START_HOUR + i;
              return (
                <div key={hour} style={{ height: `${HOUR_HEIGHT}px` }} className="relative">
                  <span className="absolute -top-2.5 right-2 text-[10px] text-muted-foreground select-none">
                    {i !== 0 ? formatHourLabel(hour) : ""}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Day columns */}
          {Array.from({ length: 7 }, (_, i) => (
            <DayColumn key={i} dayIndex={i as TWeekDay} blocks={blocks} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
