import type { IScheduleItem, INotebook, ITodo } from "./types";

export const SCHEDULE: IScheduleItem[] = [
  {
    time: "10:00 AM",
    title: "Webinar: Scaling Agile",
    subtitle: "Zoom Link · Team Beta Group A",
    color: "bg-blue-500",
    avatars: ["👩‍💼", "👨‍💼", "👩‍🔬"],
  },
  {
    time: "12:30 PM",
    title: "Analytics Deep Dive",
    subtitle: "Room 304 · Prof. Smith",
    color: "bg-yellow-400",
    avatars: [],
  },
  {
    time: "02:00 PM",
    title: "Lunch Break",
    subtitle: "Cafeteria",
    color: "bg-green-400",
    avatars: [],
    muted: true,
  },
];

export const NOTEBOOKS: INotebook[] = [
  {
    icon: "🧬",
    title: "Biology 101 Notes",
    description: "Topics: Mitochondria function, Cell respiration cycle, Krebs cycle details...",
    edited: "2h ago",
  },
  {
    icon: "🌍",
    title: "World History Thesis",
    description: "Draft for the final paper on Industrial Revolution impacts...",
    edited: "yesterday",
  },
  {
    icon: "💻",
    title: "Python Project",
    description: "Data structures implementation, Sorting algorithms...",
    edited: "3d ago",
  },
];

export const INITIAL_TODOS: ITodo[] = [
  { id: 1, label: "Submit Math Assignment", done: false },
  { id: 2, label: "Read Chapter 4 for Econ", done: true },
  { id: 3, label: "Email Professor about thesis", done: false },
  { id: 4, label: "Pick up laundry", done: false },
];
