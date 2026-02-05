'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import TaskBoard from '@/components/tasks/TaskBoard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, Plus, Settings } from 'lucide-react';
import Link from 'next/link';
import { Project } from '@/types';
import ProjectSettingsModal from '@/components/projects/ProjectSettingsModal';
import TeamMembersModal from '@/components/projects/TeamMembersModal';

export default function ProjectDetailPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && projectId) {
      fetchProject();
    }
  }, [user, projectId]);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/projects/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
      }
    } catch (error) {
      console.error('Failed to fetch project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !project) {
    return null;
  }

  // Check if current user is the owner
  const isOwner = userData?._id === project.owner?._id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/projects">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft size={18} />
              Back to Projects
            </Button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {project.name}
              </h1>
              <p className="text-gray-600">
                {project.description || 'No description provided'}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setIsTeamOpen(true)}
              >
                <Users size={18} />
                Team ({project.members.length + 1})
              </Button>
              <Button 
                variant="outline" 
                className="gap-2"
                disabled={!isOwner}
                onClick={() => setIsSettingsOpen(true)}
                title={!isOwner ? "Only owners can access settings" : ""}
              >
                <Settings size={18} />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Task Board */}
        <TaskBoard projectId={projectId} />

        {/* Modals */}
        <ProjectSettingsModal 
            project={project}
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            onProjectUpdated={(updatedProject) => setProject(updatedProject)}
        />

        <TeamMembersModal 
            project={project}
            isOpen={isTeamOpen}
            onClose={() => setIsTeamOpen(false)}
            onMemberInvited={fetchProject}
        />
      </div>
    </div>
  );
}