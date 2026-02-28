export type TLabel = "Urgent" | "Marketing" | "Design" | "Work" | "School" | "Admin" | "Personal";
export type TColumn = "todo" | "in-progress" | "completed";

export interface ITask {
  id: string;
  title: string;
  description?: string;
  labels: TLabel[];
  dueDate?: string;
  avatar?: string;
  column: TColumn;
  completed?: boolean;
}
