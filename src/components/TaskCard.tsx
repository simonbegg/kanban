import React from 'react';
import { format, isPast, isToday } from 'date-fns';
import { Clock, Trash2, Edit, AlertCircle } from 'lucide-react';
import { Task } from '../types/task';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dueDate = new Date(task.dueDate);
  const isOverdue = isPast(dueDate) && !isToday(dueDate);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg shadow-md p-4 mb-4 cursor-move w-full break-words ${
        isOverdue ? 'border-l-4 border-red-500' : ''
      }`}
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <h3 className="font-semibold text-lg flex-1 min-w-0">{task.title}</h3>
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 hover:bg-gray-100 rounded text-red-500 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className="text-gray-600 text-sm mb-2 break-words">{task.description}</p>
      )}
      
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <div className="flex items-center gap-1">
          <Clock size={14} className={isOverdue ? 'text-red-500' : 'text-gray-500'} />
          <span className={`text-sm ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
            {format(dueDate, 'MMM d, yyyy')}
          </span>
        </div>
        {isOverdue && (
          <div className="flex items-center gap-1 bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
            <AlertCircle size={12} />
            <span>Overdue</span>
          </div>
        )}
      </div>
      
      <div
        className="inline-block px-2 py-1 rounded text-sm"
        style={{ backgroundColor: `${task.category.color}20`, color: task.category.color }}
      >
        {task.category.name}
      </div>
    </div>
  );
}