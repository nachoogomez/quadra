import type { TLabel, TColumn, ITask } from "./types";

export const LABEL_COLORS: Record<TLabel, string> = {
  Urgent: "bg-red-500/20 text-red-400 border-red-500/30",
  Marketing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Design: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Work: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  School: "bg-green-500/20 text-green-400 border-green-500/30",
  Admin: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Personal: "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

export const ALL_LABELS: TLabel[] = [
  "Urgent", "Marketing", "Design", "Work", "School", "Admin", "Personal",
];

export const COLUMNS: { id: TColumn; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "completed", title: "Completed" },
];

export const INITIAL_TASKS: ITask[] = [
  { id: "1", title: "Research Competitors", labels: ["Urgent", "Marketing"], avatar: "JS", column: "todo" },
  { id: "2", title: "Draft Q3 Report", labels: ["School"], dueDate: "Oct 15", avatar: "JS", column: "todo" },
  {
    id: "3",
    title: "Design System Update",
    description: "Update the color palette and typography scale for the new mobile app.",
    labels: ["Design"],
    dueDate: "Today",
    avatar: "JS",
    column: "in-progress",
  },
  { id: "4", title: "Client Meeting Prep", labels: ["Work"], avatar: "JS", column: "in-progress" },
  { id: "5", title: "Monthly Budget Review", labels: ["Admin"], column: "completed", completed: true },
  { id: "6", title: "Schedule Interview", labels: [], column: "completed", completed: true },
];
