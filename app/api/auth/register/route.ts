import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, firebaseUid } = await req.json();

    if (!name || !email || !firebaseUid) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    let user = await User.findOne({ email });

    if (user) {
      // User exists, update firebaseUid to link account
      user.firebaseUid = firebaseUid;
      if (name) user.name = name; // Optional: update name if provided
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        firebaseUid,
      });
    }

    const token = generateToken(user._id.toString());

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        image: user.image,
        createdAt: user.createdAt,
      },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
