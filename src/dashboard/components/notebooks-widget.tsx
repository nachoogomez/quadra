import { Plus } from "lucide-react";
import type { INotebook } from "../types";

export function NotebooksWidget({ notebooks }: { notebooks: INotebook[] }) {
  return (
    <div>
      <h2 className="mb-3 text-base font-semibold text-foreground">Jump Back In</h2>
      <div className="grid grid-cols-2 gap-3">
        {notebooks.map(nb => (
          <button
            key={nb.title}
            className="group relative flex flex-col justify-end overflow-hidden rounded-xl bg-card border border-border p-4 text-left h-36 transition-colors hover:bg-accent"
          >
            <span className="absolute right-3 top-3 text-4xl opacity-20 select-none group-hover:opacity-30 transition-opacity">
              {nb.icon}
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">{nb.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{nb.description}</p>
              <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
                Edited {nb.edited}
              </p>
            </div>
          </button>
        ))}

        <button className="flex h-36 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-muted-foreground transition-colors hover:border-muted-foreground hover:text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-current">
            <Plus size={16} />
          </div>
          <span className="text-sm">New Page</span>
        </button>
      </div>
    </div>
  );
}
