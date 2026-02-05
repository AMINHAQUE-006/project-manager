import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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


    const project = await Project.findOne({
      _id: id,
      $or: [
        { owner: decoded.userId },
        { members: decoded.userId }
      ]
    }).populate('owner members', 'name email');

    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Fetch project error:', error);

    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });

    const { name, description } = await req.json();

    await connectDB();
    const project = await Project.findOne({ _id: id, owner: decoded.userId });

    if (!project) {
      return NextResponse.json({ success: false, message: 'Project not found or unauthorized' }, { status: 404 });
    }

    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    project.updatedAt = new Date();

    await project.save();

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });

    await connectDB();
    const project = await Project.findOneAndDelete({ _id: id, owner: decoded.userId });

    if (!project) {
      return NextResponse.json({ success: false, message: 'Project not found or unauthorized' }, { status: 404 });
    }

    // Optionally cleanup tasks associated with this project here
    await connectDB();
    // Assuming Task model is available or imported. If not, mongoose will handle it if we add a post middleware to Project model.
    // For now, just deleting the project.

    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
