'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Mail, UserPlus, UserCircle } from 'lucide-react';
import { Project, User } from '@/types';

interface TeamMembersModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onMemberInvited?: () => void;
}

export default function TeamMembersModal({
  project,
  isOpen,
  onClose,
  onMemberInvited
}: TeamMembersModalProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/projects/${project._id}/invite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Invitation sent successfully!' });
        setEmail('');
        if (onMemberInvited) onMemberInvited();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to send invitation' });
      }
    } catch (error) {
      console.error('Invite error:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Team Members</DialogTitle>
          <DialogDescription>
            Manage who has access to this project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Members List */}
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Current Members</h3>
            
            {/* Owner */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={project.owner.image} alt={project.owner.name} />
                  <AvatarFallback>{(project.owner.name || 'User').substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-900">{project.owner.name}</p>
                  <p className="text-xs text-gray-500">{project.owner.email}</p>
                </div>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Owner
              </span>
            </div>

            {/* Other Members */}
            {project.members.map((member) => (
              <div key={member._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback>{(member.name || 'User').substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </div>
                <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Member
                </span>
              </div>
            ))}

            {project.members.length === 0 && (
                <p className="text-center text-sm text-gray-500 py-4">No team members yet. Invite someone!</p>
            )}
          </div>

          {/* Invitation Form */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <UserPlus size={16} />
              Invite New Member
            </h3>
            <form onSubmit={handleInvite} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  className="pl-9 h-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading || !email} className="h-10">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Invite'}
              </Button>
            </form>
            {message && (
              <p className={`text-xs p-2 rounded ${
                message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message.text}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
