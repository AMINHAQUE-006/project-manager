import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import Invitation from '@/models/Invitation';
import { sendInvitationEmail } from '@/lib/mailer';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🔐 Auth check
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

    const { id } = await params;

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();
    // ✅ Ensure project exists
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      );
    }

    // ✅ Only owner can invite
    if (project.owner.toString() !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: 'Only owner can invite users' },
        { status: 403 }
      );
    }

    // ❌ Prevent duplicate invite
    const existingInvite = await Invitation.findOne({
      projectId: id,
      email,
      status: 'pending',
    });

    if (existingInvite) {
      return NextResponse.json(
        { success: false, message: 'Invitation already sent' },
        { status: 409 }
      );
    }

    // 🔑 Generate invite token
    const inviteToken = crypto.randomBytes(32).toString('hex');

    console.log(id, email, decoded.userId, inviteToken, )
    // 💾 Save invitation
    await Invitation.create({
      projectId: id,
      email,
      invitedBy: decoded.userId,
      token: inviteToken,
      status: 'pending',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
    
    // 📧 Send email
    await sendInvitationEmail({
      email,
      projectName: project.name,
      token: inviteToken,
    });

    return NextResponse.json({
      success: true,
      message: 'Invitation sent successfully',
    });
  } catch (error) {
    console.error('Invitation error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

