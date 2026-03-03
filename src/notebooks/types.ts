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
  content: string;
  color: TNoteColor;
  createdAt: string;
  editedAt: string;
}
