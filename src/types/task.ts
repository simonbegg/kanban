export type TaskCategory = {
  id: string;
  name: string;
  color: string;
};

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  createdAt: string;
  category: TaskCategory;
  status: TaskStatus;
};