'use client';

import TaskCard from './TaskCard';
import { Task } from '@/types';

interface TaskColumnProps {
  title: string;
  status: Task['status'];
  tasks: Task[];
  onDragStart: (task: Task) => void;
  onDrop: (status: Task['status']) => void;
  onTaskDeleted: (taskId: string) => void;
}

export default function TaskColumn({ 
  title, 
  status, 
  tasks, 
  onDragStart, 
  onDrop,
  onTaskDeleted 
}: TaskColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(status);
  };

  const statusColors = {
    todo: 'bg-gray-100 border-gray-300',
    inprogress: 'bg-blue-50 border-blue-300',
    review: 'bg-yellow-50 border-yellow-300',
    completed: 'bg-green-50 border-green-300',
  };

  return (
    <div
      className={`rounded-lg border-2 ${statusColors[status]} p-4 min-h-[500px]`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700 uppercase text-sm">
          {title}
        </h3>
        <span className="bg-white text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
          {tasks.length}
        </span>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onDragStart={() => onDragStart(task)}
            onDeleted={onTaskDeleted}
          />
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            No tasks yet
          </div>
        )}
      </div>
    </div>
  );
}