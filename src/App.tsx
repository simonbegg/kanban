import React, { useEffect, useState } from 'react';
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';
import { Column } from './components/Column';
import { TaskForm } from './components/TaskForm';
import { AuthForm } from './components/AuthForm';
import { useTaskStore } from './store/useTaskStore';
import { useAuthStore } from './store/useAuthStore';
import { Task, TaskStatus } from './types/task';
import { Plus, SortAsc, LogOut } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
] as const;

function App() {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [sortBy, setSortBy] = useState<string>('dueDate');
  
  const { user, loading: authLoading, signOut, initialize } = useAuthStore();
  const { tasks, loading: tasksLoading, fetchTasks, addTask, updateTask, deleteTask, moveTask } = useTaskStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      moveTask(active.id as string, over.id as TaskStatus);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleSubmit = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
      } else {
        await addTask(taskData);
      }
      setShowForm(false);
      setEditingTask(undefined);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{user.email}</span>
              <button
                onClick={() => signOut()}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut size={20} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <SortAsc size={20} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-md px-2 py-1"
              >
                <option value="category">Category</option>
                <option value="createdAt">Creation Date</option>
                <option value="dueDate">Due Date</option>
                <option value="title">Title</option>
              </select>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus size={20} />
              Add Task
            </button>
          </div>
        </div>

        {tasksLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {COLUMNS.map((column) => (
                <Column
                  key={column.id}
                  title={column.title}
                  status={column.id}
                  tasks={tasks.filter((task) => task.status === column.id)}
                  onEdit={handleEdit}
                  onDelete={deleteTask}
                  sortBy={sortBy}
                />
              ))}
            </div>
          </DndContext>
        )}

        {showForm && (
          <TaskForm
            task={editingTask}
            onSubmit={handleSubmit}
            onClose={() => {
              setShowForm(false);
              setEditingTask(undefined);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;