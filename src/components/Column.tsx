import React from 'react';
import { Task, TaskStatus } from '../types/task';
import { TaskCard } from './TaskCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface ColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  sortBy: string;
}

export function Column({ title, status, tasks, onEdit, onDelete, sortBy }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id: status });

  const sortTasks = (tasks: Task[]) => {
    switch (sortBy) {
      case 'category':
        return [...tasks].sort((a, b) => a.category.name.localeCompare(b.category.name));
      case 'createdAt':
        return [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'dueDate':
        return [...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      case 'title':
        return [...tasks].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return tasks;
    }
  };

  const sortedTasks = sortTasks(tasks);

  return (
    <div className="bg-gray-100 rounded-lg p-4 min-h-[200px] w-full">
      <h2 className="font-bold text-xl mb-4">{title}</h2>
      <div ref={setNodeRef} className="space-y-4">
        <SortableContext items={sortedTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}