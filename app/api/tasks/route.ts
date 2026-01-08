import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import User from '@/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

/* =========================
   GET TASKS
========================= */
export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    const query: any = {};

    if (projectId) {
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return NextResponse.json(
          { success: false, message: 'Invalid projectId' },
          { status: 400 }
        );
      }
      query.projectId = projectId;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

/* =========================
   CREATE TASK
========================= */
export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectDB();

    const {
      projectId,
      title,
      description,
      priority = 'medium',
      assignedTo, // email
    } = await req.json();

    if (!projectId || !title) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid projectId' },
        { status: 400 }
      );
    }

    let assignedUserId = null;

    if (assignedTo) {
      const user = await User.findOne({ email: assignedTo });

      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Assigned user not found' },
          { status: 404 }
        );
      }

      assignedUserId = user._id;
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      priority,
      assignedTo: assignedUserId,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email');

    return NextResponse.json(
      { success: true, task: populatedTask },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
