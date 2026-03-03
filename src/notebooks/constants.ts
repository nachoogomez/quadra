import type { INotebook, INote, TNoteColor } from "./types";

export const NOTE_COLOR_CLASSES: Record<TNoteColor, { bg: string; dot: string }> = {
  default: { bg: "bg-card",          dot: "bg-muted-foreground/40" },
  blue:    { bg: "bg-blue-500/10",   dot: "bg-blue-500" },
  green:   { bg: "bg-green-500/10",  dot: "bg-green-500" },
  yellow:  { bg: "bg-yellow-400/10", dot: "bg-yellow-400" },
  purple:  { bg: "bg-purple-500/10", dot: "bg-purple-500" },
  red:     { bg: "bg-red-500/10",    dot: "bg-red-500" },
};

export const ALL_COLORS: TNoteColor[] = ["default", "blue", "green", "yellow", "purple", "red"];

export const INITIAL_NOTEBOOKS: INotebook[] = [
  { id: "nb-1", title: "Calculus 101",    icon: "📐", color: "yellow", createdAt: "2025-09-01", editedAt: "2025-09-10" },
  { id: "nb-2", title: "Art History",     icon: "🎨", color: "purple", createdAt: "2025-09-02", editedAt: "2025-09-11" },
  { id: "nb-3", title: "Macroeconomics",  icon: "📈", color: "red",    createdAt: "2025-09-03", editedAt: "2025-09-09" },
  { id: "nb-4", title: "Data Structures", icon: "💻", color: "blue",   createdAt: "2025-09-04", editedAt: "2025-09-08" },
  { id: "nb-5", title: "Intro to Psych",  icon: "🧠", color: "green",  createdAt: "2025-09-05", editedAt: "2025-09-07" },
];

export const INITIAL_NOTES: INote[] = [
  // Calculus 101
  {
    id: "n-1", notebookId: "nb-1", title: "Limits & Continuity", color: "default",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "A limit describes the value a function approaches as the input approaches some value." }] }] }),
    createdAt: "2025-09-01", editedAt: "2025-09-10",
  },
  {
    id: "n-2", notebookId: "nb-1", title: "Derivatives", color: "default",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "The derivative measures the rate of change of a function with respect to a variable." }] }] }),
    createdAt: "2025-09-02", editedAt: "2025-09-09",
  },
  {
    id: "n-3", notebookId: "nb-1", title: "Integrals", color: "default",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Integration is the reverse process of differentiation." }] }] }),
    createdAt: "2025-09-03", editedAt: "2025-09-08",
  },
  // Art History
  {
    id: "n-4", notebookId: "nb-2", title: "Renaissance Period", color: "default",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "The Renaissance was a cultural movement that began in Italy during the 14th century." }] }] }),
    createdAt: "2025-09-02", editedAt: "2025-09-11",
  },
  {
    id: "n-5", notebookId: "nb-2", title: "Baroque Art", color: "default",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Baroque art is characterized by dramatic expression and rich detail." }] }] }),
    createdAt: "2025-09-03", editedAt: "2025-09-10",
  },
  // Macroeconomics
  {
    id: "n-6", notebookId: "nb-3", title: "GDP & Growth", color: "default",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Gross Domestic Product measures the total value of goods and services produced." }] }] }),
    createdAt: "2025-09-03", editedAt: "2025-09-09",
  },
  {
    id: "n-7", notebookId: "nb-3", title: "Inflation", color: "default",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Inflation is the rate at which the general level of prices for goods and services rises." }] }] }),
    createdAt: "2025-09-04", editedAt: "2025-09-08",
  },
  // Data Structures
  {
    id: "n-8", notebookId: "nb-4", title: "Trees & Graphs", color: "default",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "A tree is a hierarchical data structure with a root node and subtrees of children." }] }] }),
    createdAt: "2025-09-04", editedAt: "2025-09-08",
  },
  {
    id: "n-9", notebookId: "nb-4", title: "Sorting Algorithms", color: "default",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Common sorting algorithms: quicksort O(n log n), mergesort O(n log n), bubblesort O(n²)." }] }] }),
    createdAt: "2025-09-05", editedAt: "2025-09-07",
  },
  // Intro to Psych
  {
    id: "n-10", notebookId: "nb-5", title: "Behavioral Studies", color: "default",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Behavioral psychology focuses on observable behaviors and how they are learned." }] }] }),
    createdAt: "2025-09-05", editedAt: "2025-09-07",
  },
  // Standalone note (no notebookId)
  {
    id: "n-11", notebookId: null, title: "Meeting Notes - Sept 10", color: "blue",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Discussed project timeline and upcoming deliverables for Q4." }] }] }),
    createdAt: "2025-09-10", editedAt: "2025-09-10",
  },
];
