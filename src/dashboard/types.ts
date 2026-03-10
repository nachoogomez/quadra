export interface IScheduleItem {
  time: string;
  title: string;
  subtitle: string;
  color: string;
  avatars: string[];
  muted?: boolean;
}

export interface INotebook {
  id: string;
  icon: string;
  title: string;
  description: string;
  edited: string;
}

export interface ITodo {
  id: string;
  label: string;
  done: boolean;
}
