'use client';

import { useEffect, useState } from 'react';
import TaskColumn from './TaskColumn';
import CreateTaskModal from './CreateTaskModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Task } from '@/types';

interface TaskBoardProps {
  projectId: string;
}

export default function TaskBoard({ projectId }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/tasks?projectId=${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDrop = async (newStatus: Task['status'], taskId: string) => {
    const task = tasks.find(t => t._id === taskId);
    
    if (!task || task.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    // Optimistic update
    setTasks(tasks.map(t => 
      t._id === taskId ? { ...t, status: newStatus } : t
    ));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        // Revert on failure
        setTasks(tasks.map(t => 
          t._id === taskId ? { ...t, status: task.status } : t
        ));
        console.error('Failed to update task status');
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      // Revert on failure
      setTasks(tasks.map(t => 
        t._id === taskId ? { ...t, status: task.status } : t
      ));
    } finally {
      setDraggedTask(null);
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prev) => {
      const exists = prev.find(t => t._id === newTask._id);
      if (exists) {
        return prev.map(t => t._id === newTask._id ? newTask : t);
      }
      return [...prev, newTask];
    });
    setEditingTask(null);
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks(tasks.filter(t => t._id !== taskId));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingTask(null);
  };

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'inprogress');
  const reviewTasks = tasks.filter(t => t.status === 'review');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus size={18} />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TaskColumn
          title="To Do"
          status="todo"
          tasks={todoTasks}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onTaskDeleted={handleTaskDeleted}
          onEdit={handleEditTask}
        />
        <TaskColumn
          title="In Progress"
          status="inprogress"
          tasks={inProgressTasks}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onTaskDeleted={handleTaskDeleted}
          onEdit={handleEditTask}
        />
        <TaskColumn
          title="Review"
          status="review"
          tasks={reviewTasks}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onTaskDeleted={handleTaskDeleted}
          onEdit={handleEditTask}
        />
        <TaskColumn
          title="Completed"
          status="completed"
          tasks={completedTasks}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onTaskDeleted={handleTaskDeleted}
          onEdit={handleEditTask}
        />
      </div>

      <CreateTaskModal
        projectId={projectId}
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onTaskCreated={handleTaskCreated}
        taskToEdit={editingTask}
      />
    </div>
  );
}