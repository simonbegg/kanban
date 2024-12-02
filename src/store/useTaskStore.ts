import { create } from 'zustand';
import { Task, TaskStatus } from '../types/task';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './useAuthStore';
import toast from 'react-hot-toast';

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (taskId: string, newStatus: TaskStatus) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  fetchTasks: async () => {
    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        throw new Error('User not authenticated');
      }

      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const tasks = data.map((task) => ({
        ...task,
        dueDate: task.due_date,
        createdAt: task.created_at,
        category: JSON.parse(task.category),
      }));

      set({ tasks, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch tasks';
      set({ error: message, loading: false });
      toast.error(message);
    }
  },
  addTask: async (task) => {
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            title: task.title,
            description: task.description,
            due_date: task.dueDate,
            user_id: user.id,
            category: JSON.stringify(task.category),
            status: task.status,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        tasks: [
          {
            ...data,
            dueDate: data.due_date,
            createdAt: data.created_at,
            category: JSON.parse(data.category),
          },
          ...state.tasks,
        ],
      }));
      toast.success('Task added successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add task';
      toast.error(message);
      throw error;
    }
  },
  updateTask: async (id, updatedTask) => {
    try {
      const updateData: any = {};
      if (updatedTask.title) updateData.title = updatedTask.title;
      if (updatedTask.description !== undefined) updateData.description = updatedTask.description;
      if (updatedTask.dueDate) updateData.due_date = updatedTask.dueDate;
      if (updatedTask.category) updateData.category = JSON.stringify(updatedTask.category);
      if (updatedTask.status) updateData.status = updatedTask.status;

      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, ...updatedTask } : task
        ),
      }));
      toast.success('Task updated successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update task';
      toast.error(message);
      throw error;
    }
  },
  deleteTask: async (id) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);

      if (error) throw error;

      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      }));
      toast.success('Task deleted successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete task';
      toast.error(message);
      throw error;
    }
  },
  moveTask: async (taskId, newStatus) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        ),
      }));
      toast.success('Task moved successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to move task';
      toast.error(message);
      throw error;
    }
  },
}));