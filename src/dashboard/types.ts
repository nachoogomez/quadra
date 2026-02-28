export interface IScheduleItem {
  time: string;
  title: string;
  subtitle: string;
  color: string;
  avatars: string[];
  muted?: boolean;
}

export interface INotebook {
  icon: string;
  title: string;
  description: string;
  edited: string;
}

export interface ITodo {
  id: number;
  label: string;
  done: boolean;
}
