'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Task } from '@/types';


interface CreateTaskModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: Task) => void;
  taskToEdit?: Task | null;
}

export default function CreateTaskModal({
  projectId,
  isOpen,
  onClose,
  onTaskCreated,
  taskToEdit
}: CreateTaskModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    assignedTo: '',
  });

  // Effect to populate form when editing
  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        description: taskToEdit.description,
        priority: taskToEdit.priority,
        assignedTo: taskToEdit.assignedTo ? taskToEdit.assignedTo.email : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        assignedTo: '',
      });
    }
  }, [taskToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = taskToEdit 
        ? `/api/tasks/${taskToEdit._id}` 
        : '/api/tasks';
      
      const method = taskToEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          projectId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onTaskCreated(data.task);
        if (!taskToEdit) {
            setFormData({
            title: '',
            description: '',
            priority: 'medium',
            assignedTo: '',
            });
        }
        onClose();
      }
    } catch (error) {
      console.error('Failed to save task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{taskToEdit ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {taskToEdit ? 'Update task details' : 'Add a new task to your project'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="Design homepage mockup"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the task..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: Task['priority']) =>
                setFormData({ ...formData, priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assign To (Email)</Label>
            <Input
              id="assignedTo"
              type="email"
              placeholder="john@example.com"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {taskToEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              taskToEdit ? 'Update Task' : 'Create Task'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
