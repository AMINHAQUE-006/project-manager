'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { FolderKanban, CheckSquare, Clock, CalendarDays, Mail, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';

type ProfileStats = {
  projectsOwned: number;
  projectsParticipating: number;
  tasksAssigned: number;
  totalProjects: number;
};

export default function ProfilePage() {
  const { user, userData, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/profile/stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch profile stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    if (userData) {
      fetchStats();
    } else if (!authLoading && !user) {
        // Not logged in or handled by auth loading
        setLoadingStats(false);
    }
  }, [userData, user, authLoading]);

  if (authLoading) {
     return <ProfileSkeleton />;
  }

  if (!user && !authLoading) {
      return (
          <div className="container mx-auto p-6 flex items-center justify-center h-[calc(100vh-4rem)]">
              <p className="text-muted-foreground">Please log in to view your profile.</p>
          </div>
      )
  }

  const displayName = userData?.name || user?.displayName || 'User';
  const email = userData?.email || user?.email || '';
  const photoUrl = user?.photoURL || userData?.image;
  const joinDate = userData?.createdAt ? new Date(userData.createdAt) : (user?.metadata.creationTime ? new Date(user.metadata.creationTime) : new Date());

  return (
    <div className="container max-w-5xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
          <AvatarImage src={photoUrl || undefined} alt={displayName} />
          <AvatarFallback className="text-4xl">{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{displayName}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mt-1">
              <Mail className="h-4 w-4" />
              <span>{email}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
             <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border">
                <CalendarDays className="h-4 w-4 text-blue-500" />
                <span>Joined {format(joinDate, 'MMMM yyyy')}</span>
             </div>
             {/* Add more badges if needed (e.g. Role) */}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <h2 className="text-xl font-semibold text-gray-900">Activity Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <FolderKanban className="h-4 w-4 text-blue-500" />
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
             {loadingStats ? (
                 <Skeleton className="h-8 w-16" />
             ) : (
                 <div className="text-3xl font-bold text-gray-900">{stats?.totalProjects || 0}</div>
             )}
             <p className="text-xs text-muted-foreground mt-1">
               {stats ? `${stats.projectsOwned} owned, ${stats.projectsParticipating} participating` : 'Loading details...'}
             </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-green-500" />
              Tasks Assigned
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStats ? (
                <Skeleton className="h-8 w-16" />
            ) : (
                <div className="text-3xl font-bold text-gray-900">{stats?.tasksAssigned || 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Active tasks</p>
          </CardContent>
        </Card>

         <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-bold text-gray-900">--</div>
            <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

function ProfileSkeleton() {
    return (
        <div className="container max-w-5xl mx-auto p-6 space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-6 p-8 rounded-xl border">
                <Skeleton className="h-32 w-32 rounded-full" />
                <div className="space-y-4 flex-1">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-24" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="h-32">
                        <CardHeader><Skeleton className="h-4 w-24" /></CardHeader>
                        <CardContent><Skeleton className="h-8 w-16" /></CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
