export type TNoteColor = "default" | "blue" | "green" | "yellow" | "purple" | "red";

export type TView = "grid" | "notebook" | "editor";

export interface INotebook {
  id: string;
  title: string;
  icon: string;
  color: TNoteColor;
  createdAt: string;
  editedAt: string;
}

export interface INote {
  id: string;
  notebookId: string | null;
  title: string;
  content: string; // JSON string (Tiptap doc)
  color: TNoteColor;
  createdAt: string;
  editedAt: string;
}

// ─── DB row shapes (snake_case) ───────────────────────────────────────────────

export interface INotebookRow {
  id: string;
  user_id: string;
  title: string;
  icon: string;
  color: TNoteColor;
  created_at: string;
  edited_at: string;
}

export interface INoteRow {
  id: string;
  user_id: string;
  notebook_id: string | null;
  title: string;
  content: Record<string, unknown>; // jsonb — Tiptap doc object
  color: TNoteColor;
  created_at: string;
  edited_at: string;
}
