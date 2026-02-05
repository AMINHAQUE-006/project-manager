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
    const userId = decoded.userId;

    const [projectsOwned, projectsParticipating, tasksAssigned] = await Promise.all([
      Project.countDocuments({ owner: userId }),
      Project.countDocuments({ members: userId }),
      Task.countDocuments({ assignedTo: userId }),
    ]);

    // Note: projectsParticipating might overlap with owned if the owner is also in the members array. 
    // Usually owner is distinct or implicitly a member. 
    // Based on Project.ts, owner is separate field. Members is an array.
    // If owner is NOT in members array, then 'Total Projects' = owned + participating.

    return NextResponse.json({
      success: true,
      stats: {
        projectsOwned,
        projectsParticipating,
        tasksAssigned,
        totalProjects: projectsOwned + projectsParticipating
      }
    });
  } catch (error) {
    console.error('Profile stats error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
