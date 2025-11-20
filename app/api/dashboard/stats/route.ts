import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import Task from '@/models/Task';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    await connectDB();

    // Get user's projects
    const projects = await Project.find({
      $or: [{ owner: decoded.userId }, { members: decoded.userId }],
    });

    const projectIds = projects.map(p => p._id);

    // Get tasks for these projects
    const tasks = await Task.find({ projectId: { $in: projectIds } });
    const completedTasks = tasks.filter(t => t.status === 'completed');

    // Get unique team members
    const teamMembers = new Set();
    projects.forEach(project => {
      project.members.forEach((member: any) => teamMembers.add(member.toString()));
    });

    const stats = {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      teamMembers: teamMembers.size,
    };

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}