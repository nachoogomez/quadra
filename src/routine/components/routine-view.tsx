"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoutineProvider } from "@/routine/context";
import { RoutineWeekGrid } from "./routine-week-grid";
import { RoutineBlockDialog } from "./dialogs/routine-block-dialog";

interface IProps {
  userId: string;
}

export function RoutineView({ userId }: IProps) {
  return (
    <RoutineProvider userId={userId}>
      <div className="flex flex-col gap-4 p-6 h-full">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-semibold">Weekly Schedule</h1>
            <p className="text-sm text-muted-foreground">
              Manage your classes, gym sessions, and recurring commitments
            </p>
          </div>

          <RoutineBlockDialog>
            <Button size="sm">
              <Plus size={16} className="mr-1.5" />
              New block
            </Button>
          </RoutineBlockDialog>
        </div>

        <div className="flex-1 rounded-lg border border-border overflow-hidden min-h-0 flex flex-col">
          <RoutineWeekGrid />
        </div>
      </div>
    </RoutineProvider>
  );
}
