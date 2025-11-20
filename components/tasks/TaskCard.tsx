'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2, Edit2 } from 'lucide-react';
import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onDragStart: () => void;
  onDeleted: (taskId: string) => void;
}

export default function TaskCard({ task, onDragStart, onDeleted }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/tasks/${task._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        onDeleted(task._id);
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  };

  return (
    <Card
      draggable
      onDragStart={onDragStart}
      className="cursor-move hover:shadow-md transition-shadow"
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-2 mb-2">
          <GripVertical className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
            {task.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                // Edit functionality
              }}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-red-600 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isDeleting}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={priorityColors[task.priority]} variant="secondary">
            {task.priority}
          </Badge>
          {task.assignedTo && (
            <Badge variant="outline" className="text-xs">
              {task.assignedTo}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}