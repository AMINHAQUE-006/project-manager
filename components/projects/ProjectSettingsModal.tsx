'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Trash2, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Project } from '@/types';

interface ProjectSettingsModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onProjectUpdated: (project: Project) => void;
}

export default function ProjectSettingsModal({
  project,
  isOpen,
  onClose,
  onProjectUpdated
}: ProjectSettingsModalProps) {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const router = useRouter();

  useEffect(() => {
    if (isOpen && project) {
      setFormData({
        name: project.name,
        description: project.description || '',
      });
      setShowDeleteConfirm(false);
    }
  }, [isOpen, project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/projects/${project._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        onProjectUpdated(data.project);
        onClose();
      }
    } catch (error) {
      console.error('Failed to update project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/projects/${project._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        onClose();
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Project Settings</DialogTitle>
          <DialogDescription>
            Modify your project details or manage its lifecycle.
          </DialogDescription>
        </DialogHeader>

        {!showDeleteConfirm ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Project Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
              <div className="border-t pt-4">
                <Button 
                  type="button" 
                  variant="destructive" 
                  className="w-full gap-2"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 size={16} />
                  Delete Project
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-6 pt-4 text-center">
            <div className="flex flex-col items-center gap-2 text-red-600">
              <AlertTriangle size={48} />
              <h3 className="text-xl font-bold">Are you absolutely sure?</h3>
            </div>
            <p className="text-gray-600">
              This action cannot be undone. This will permanently delete the project 
              <strong> {project.name}</strong> and all associated tasks.
            </p>
            <div className="flex flex-col gap-3">
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Yes, Delete Project
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
