"use client";

import { RoutineBlockDialog } from "./dialogs/routine-block-dialog";
import { cn } from "@/lib/utils";
import type { IRoutineBlock, TRoutineColor } from "@/routine/types";

const COLOR_STYLES: Record<TRoutineColor, { bg: string; border: string; text: string }> = {
  blue:   { bg: "bg-blue-500/15 dark:bg-blue-500/20",   border: "border-l-blue-500",   text: "text-blue-700 dark:text-blue-300" },
  green:  { bg: "bg-green-500/15 dark:bg-green-500/20", border: "border-l-green-500",  text: "text-green-700 dark:text-green-300" },
  red:    { bg: "bg-red-500/15 dark:bg-red-500/20",     border: "border-l-red-500",    text: "text-red-700 dark:text-red-300" },
  yellow: { bg: "bg-yellow-500/15 dark:bg-yellow-500/20", border: "border-l-yellow-500", text: "text-yellow-700 dark:text-yellow-300" },
  purple: { bg: "bg-purple-500/15 dark:bg-purple-500/20", border: "border-l-purple-500", text: "text-purple-700 dark:text-purple-300" },
  orange: { bg: "bg-orange-500/15 dark:bg-orange-500/20", border: "border-l-orange-500", text: "text-orange-700 dark:text-orange-300" },
  gray:   { bg: "bg-neutral-500/15 dark:bg-neutral-500/20", border: "border-l-neutral-500", text: "text-neutral-700 dark:text-neutral-300" },
};

function formatTime(h: number, m: number) {
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${displayH}:${m === 0 ? "00" : "30"} ${period}`;
}

interface IProps {
  block: IRoutineBlock;
  style: React.CSSProperties;
}

export function RoutineBlockCard({ block, style }: IProps) {
  const colors = COLOR_STYLES[block.color];
  const durationMin = (block.endHour * 60 + block.endMinute) - (block.startHour * 60 + block.startMinute);
  const isCompact = durationMin <= 30;

  return (
    <RoutineBlockDialog existingBlock={block}>
      <div
        className={cn(
          "absolute inset-x-0.5 rounded-md border-l-[3px] cursor-pointer overflow-hidden transition-opacity hover:opacity-90 select-none",
          colors.bg,
          colors.border
        )}
        style={style}
      >
        <div className="px-2 py-1 h-full flex flex-col justify-start overflow-hidden">
          <p className={cn("text-xs font-semibold leading-tight truncate", colors.text)}>
            {block.title}
          </p>
          {!isCompact && block.location && (
            <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">
              {block.location}
            </p>
          )}
          {!isCompact && (
            <p className="text-[10px] text-muted-foreground truncate leading-tight mt-auto pt-1">
              {formatTime(block.startHour, block.startMinute)} – {formatTime(block.endHour, block.endMinute)}
            </p>
          )}
        </div>
      </div>
    </RoutineBlockDialog>
  );
}
