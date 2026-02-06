  import { NextRequest, NextResponse } from "next/server";
  import connectDB from "@/lib/mongodb";
  import Invitation from "@/models/Invitation";
  import Project from "@/models/Project";
  import User from "@/models/User";
  import { getTokenFromRequest, verifyToken } from "@/lib/auth";

  export async function POST(req: NextRequest) {
    try {
      // 🔐 AUTH
      const authToken = getTokenFromRequest(req);

      if (!authToken) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 }
        );
      }

      const decoded: any = verifyToken(authToken);

      if (!decoded?.userId) {
        return NextResponse.json(
          { success: false, message: "Invalid token" },
          { status: 401 }
        );
      }

      // 📩 invite token
      const { token } = await req.json();

      if (!token) {
        return NextResponse.json(
          { success: false, message: "Invite token missing" },
          { status: 400 }
        );
      }

      await connectDB();

      // 👤 fetch real user
      const user = await User.findById(decoded.userId).select("email");

      if (!user) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }

      // 🔍 find invitation
      const invite = await Invitation.findOne({ token });

      if (!invite) {
        return NextResponse.json(
          { success: false, message: "Invalid invitation" },
          { status: 404 }
        );
      }

      // ⏰ expired
      if (invite.expiresAt < new Date()) {
        invite.status = "expired";
        await invite.save();

        return NextResponse.json(
          { success: false, message: "Invitation expired" },
          { status: 410 }
        );
      }

      // 🚫 already used
      if (invite.status !== "pending") {
        return NextResponse.json(
          { success: false, message: "Invitation already used" },
          { status: 409 }
        );
      }

      // 📧 email must match
      if (
        invite.email.toLowerCase() !== user.email.toLowerCase()
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "This invite was not sent to your email",
          },
          { status: 403 }
        );
      }

      // 📁 project
      const project = await Project.findById(invite.projectId);

      if (!project) {
        return NextResponse.json(
          { success: false, message: "Project not found" },
          { status: 404 }
        );
      }

      // ➕ add member
      if (!project.members.includes(decoded.userId)) {
        project.members.push(decoded.userId);
      }

      await project.save();

      // ✅ mark invite used
      invite.status = "accepted";
      await invite.save();

      return NextResponse.json({
        success: true,
        message: "Invitation accepted successfully",
        projectId: project._id,
      });
    } catch (error) {
      console.error("Accept invitation error:", error);
      return NextResponse.json(
        { success: false, message: "Server error" },
        { status: 500 }
      );
    }
  }
